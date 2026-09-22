package com.placepro.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class ContentRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public ContentRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    public List<Map<String, Object>> dsaTopics() {
        return jdbc.queryForList("select id,name,description,sort_order as \"order\" from dsa_topics order by sort_order");
    }

    public List<Map<String, Object>> dsaProblems(UUID userId) {
        return jdbc.query("""
                select p.id,p.number,p.title,p.topic_id as "topicId",p.difficulty,p.pattern,p.description,
                       p.examples::text as examples,p.constraints_text as constraints,
                       coalesce(up.solved,false) as solved, coalesce(up.bookmarked,false) as bookmarked
                from dsa_problems p
                left join user_dsa_progress up on up.problem_id=p.id and up.user_id=?
                order by p.number
                """, (rs, rowNum) -> map()
                .put("id", rs.getString("id"))
                .put("number", rs.getInt("number"))
                .put("title", rs.getString("title"))
                .put("topicId", rs.getString("topicId"))
                .put("difficulty", rs.getString("difficulty"))
                .put("pattern", rs.getString("pattern"))
                .put("description", rs.getString("description"))
                .put("examples", jsonList(rs.getString("examples")))
                .put("constraints", rs.getString("constraints"))
                .put("solved", rs.getBoolean("solved"))
                .put("bookmarked", rs.getBoolean("bookmarked"))
                .done(), userOrNil(userId));
    }

    public Optional<Map<String, Object>> dsaProblem(String id, UUID userId) {
        return dsaProblems(userId).stream().filter(p -> id.equals(p.get("id"))).findFirst();
    }

    public Map<String, Object> upsertDsaProgress(UUID userId, String id, Boolean solved, Boolean bookmarked) {
        jdbc.update("""
                insert into user_dsa_progress (user_id, problem_id, solved, bookmarked)
                values (?, ?, coalesce(?, false), coalesce(?, false))
                on conflict (user_id, problem_id) do update set
                  solved = coalesce(?, user_dsa_progress.solved),
                  bookmarked = coalesce(?, user_dsa_progress.bookmarked),
                  updated_at = now()
                """, userId, id, solved, bookmarked, solved, bookmarked);
        return dsaProblem(id, userId).orElseThrow();
    }

    public List<Map<String, Object>> codingProblems(UUID userId) {
        return jdbc.query("""
                select p.*, p.constraints_json::text as constraints, p.examples::text as examples,
                       p.hints::text as hints, p.starter_code::text as starter_code,
                       coalesce(up.solved,false) as solved, coalesce(up.bookmarked,false) as bookmarked
                from coding_problems p
                left join user_coding_progress up on up.problem_id=p.id and up.user_id=?
                order by p.number
                """, (rs, rowNum) -> map()
                .put("id", rs.getString("id"))
                .put("number", rs.getInt("number"))
                .put("title", rs.getString("title"))
                .put("difficulty", rs.getString("difficulty"))
                .put("topic", rs.getString("topic"))
                .put("pattern", rs.getString("pattern"))
                .put("description", rs.getString("description"))
                .put("examples", jsonList(rs.getString("examples")))
                .put("constraints", jsonList(rs.getString("constraints")))
                .put("hints", jsonList(rs.getString("hints")))
                .put("starterCode", jsonMap(rs.getString("starter_code")))
                .put("isFree", rs.getBoolean("is_free"))
                .put("solved", rs.getBoolean("solved"))
                .put("bookmarked", rs.getBoolean("bookmarked"))
                .done(), userOrNil(userId));
    }

    public Optional<Map<String, Object>> codingProblem(String id, UUID userId) {
        return codingProblems(userId).stream().filter(p -> id.equals(p.get("id"))).findFirst();
    }

    public Map<String, Object> upsertCodingProgress(UUID userId, String id, Boolean solved, Boolean bookmarked) {
        jdbc.update("""
                insert into user_coding_progress (user_id, problem_id, solved, bookmarked)
                values (?, ?, coalesce(?, false), coalesce(?, false))
                on conflict (user_id, problem_id) do update set
                  solved = coalesce(?, user_coding_progress.solved),
                  bookmarked = coalesce(?, user_coding_progress.bookmarked),
                  updated_at = now()
                """, userId, id, solved, bookmarked, solved, bookmarked);
        return codingProblem(id, userId).orElseThrow();
    }

    public List<Map<String, Object>> aptitudeCategories(UUID userId) {
        return jdbc.query("""
                select c.*, count(t.id) as topics, coalesce(sum(t.question_count),0) as questions
                from aptitude_categories c
                left join aptitude_topics t on t.category_id=c.id
                group by c.id
                order by c.sort_order
                """, (rs, rowNum) -> {
            String id = rs.getString("id");
            int progress = aptitudeCategoryProgress(id, userId);
            return map().put("id", id).put("name", rs.getString("name")).put("icon", rs.getString("icon"))
                    .put("description", rs.getString("description")).put("difficulty", rs.getString("difficulty"))
                    .put("premium", rs.getBoolean("premium")).put("topics", rs.getInt("topics"))
                    .put("questions", rs.getInt("questions")).put("progress", progress).done();
        });
    }

    public List<Map<String, Object>> aptitudeTopics(String categoryId, UUID userId) {
        return jdbc.query("""
                select t.*, count(q.id) as real_questions
                from aptitude_topics t
                left join aptitude_questions q on q.topic_id=t.id
                where t.category_id=?
                group by t.id
                order by t.sort_order
                """, (rs, rowNum) -> map()
                .put("id", rs.getString("id"))
                .put("name", rs.getString("name"))
                .put("description", rs.getString("description"))
                .put("difficulty", rs.getString("difficulty"))
                .put("questions", rs.getInt("question_count"))
                .put("free", rs.getBoolean("free"))
                .put("progress", aptitudeTopicProgress(rs.getString("id"), userId))
                .done(), categoryId);
    }

    public List<Map<String, Object>> aptitudeQuestions(String topicId) {
        return jdbc.query("""
                select id,topic_id,question,options::text,correct_answer,explanation,free,difficulty
                from aptitude_questions where topic_id=? order by id
                """, (rs, rowNum) -> map()
                .put("id", rs.getString("id")).put("topicId", rs.getString("topic_id"))
                .put("question", rs.getString("question")).put("options", jsonList(rs.getString("options")))
                .put("correctAnswer", rs.getInt("correct_answer")).put("explanation", rs.getString("explanation"))
                .put("free", rs.getBoolean("free")).put("difficulty", rs.getString("difficulty")).done(), topicId);
    }

    public List<Map<String, Object>> companies(UUID userId) {
        return jdbc.query("""
                select c.*, coalesce(up.bookmarked,false) as bookmarked
                from companies c
                left join user_company_progress up on up.company_id=c.id and up.user_id=?
                order by c.name
                """, (rs, rowNum) -> map().put("id", rs.getString("id")).put("name", rs.getString("name"))
                .put("type", rs.getString("type")).put("difficulty", rs.getString("difficulty"))
                .put("premium", rs.getBoolean("premium")).put("description", rs.getString("description"))
                .put("areas", jsonList(rs.getString("areas"))).put("modules", rs.getInt("modules"))
                .put("bookmarked", rs.getBoolean("bookmarked")).done(), userOrNil(userId));
    }

    public Optional<Map<String, Object>> company(String id, UUID userId) {
        return companies(userId).stream().filter(c -> id.equals(c.get("id"))).findFirst();
    }

    public Map<String, Object> companyPreparation(String id, UUID userId) {
        Map<String, Object> company = company(id, userId).orElse(null);
        if (company == null) return null;
        List<Map<String, Object>> modules = jdbc.queryForList("select id,title,description,icon,free,0 as progress,action from company_modules order by sort_order");
        List<String> roadmap = jdbc.queryForList("select label from company_roadmap_steps order by sort_order", String.class);
        Map<String, Object> progress = jdbc.query("""
                select overall,aptitude,dsa,technical,interview
                from user_company_progress where user_id=? and company_id=?
                """, rs -> rs.next() ? map().put("overall", rs.getInt("overall")).put("aptitude", rs.getInt("aptitude")).put("dsa", rs.getInt("dsa")).put("technical", rs.getInt("technical")).put("interview", rs.getInt("interview")).done()
                : map().put("overall", 0).put("aptitude", 0).put("dsa", 0).put("technical", 0).put("interview", 0).done(), userOrNil(userId), id);
        return map().put("company", company).put("modules", modules).put("roadmap", roadmap).put("progress", progress).put("freeModules", 1).done();
    }

    public Map<String, Object> updateCompanyBookmark(UUID userId, String id, boolean bookmarked) {
        jdbc.update("""
                insert into user_company_progress (user_id, company_id, bookmarked)
                values (?, ?, ?)
                on conflict (user_id, company_id) do update set bookmarked=excluded.bookmarked, updated_at=now()
                """, userId, id, bookmarked);
        return company(id, userId).orElseThrow();
    }

    public Map<String, Object> learning(UUID userId) {
        List<Map<String, Object>> semesters = jdbc.queryForList("select id,name,subjects,0 as progress,drive_url as \"driveUrl\" from learning_semesters order by sort_order");
        List<Map<String, Object>> subjects = jdbc.queryForList("select id,name,code,topics,0 as progress from semester_subjects order by sort_order");
        List<Map<String, Object>> topics = jdbc.queryForList("select id,name,minutes,false as complete,false as current from subject_topics order by sort_order");
        if (!topics.isEmpty()) {
            for (int i = 0; i < topics.size(); i++) {
                topics.get(i).put("complete", i < 4);
                topics.get(i).put("current", i == 4);
            }
        }
        List<Map<String, Object>> dsaModules = jdbc.queryForList("select id,name,level,lessons,0 as progress from learning_dsa_modules order by sort_order");
        List<Map<String, Object>> dsaLessons = jdbc.queryForList("select name,false as complete,false as current from learning_dsa_lessons where module_id='arrays' order by sort_order");
        for (int i = 0; i < dsaLessons.size(); i++) {
            dsaLessons.get(i).put("complete", i < 5);
            dsaLessons.get(i).put("current", i == 5);
        }
        return map().put("semesters", semesters).put("subjects", subjects).put("topics", topics).put("dsaModules", dsaModules).put("dsaLessons", dsaLessons).done();
    }

    public List<Map<String, Object>> mockTests() {
        return jdbc.query("""
                select t.*, t.sections::text as sections, count(q.id) as total_questions
                from mock_tests t left join mock_test_questions q on q.test_id=t.id
                group by t.id order by t.title
                """, (rs, rowNum) -> map().put("id", rs.getString("id")).put("title", rs.getString("title"))
                .put("type", rs.getString("type")).put("category", rs.getString("category")).put("difficulty", rs.getString("difficulty"))
                .put("durationMinutes", rs.getInt("duration_minutes")).put("isFree", rs.getBoolean("is_free"))
                .put("totalQuestions", rs.getInt("total_questions")).put("sections", jsonList(rs.getString("sections")))
                .put("marksPerQuestion", rs.getInt("marks_per_question")).done());
    }

    public Optional<Map<String, Object>> mockTest(String id) {
        Optional<Map<String, Object>> base = mockTests().stream().filter(t -> id.equals(t.get("id"))).findFirst();
        base.ifPresent(test -> test.put("questions", mockQuestions(id)));
        return base;
    }

    public List<Map<String, Object>> mockQuestions(String id) {
        return jdbc.query("""
                select id,section,topic,difficulty,question,options::text,correct_answer,explanation
                from mock_test_questions where test_id=? order by sort_order
                """, (rs, rowNum) -> map().put("id", rs.getString("id")).put("section", rs.getString("section"))
                .put("topic", rs.getString("topic")).put("difficulty", rs.getString("difficulty")).put("question", rs.getString("question"))
                .put("options", jsonList(rs.getString("options"))).put("correctAnswer", rs.getInt("correct_answer"))
                .put("explanation", rs.getString("explanation")).done(), id);
    }

    public Map<String, Object> saveMockAttempt(UUID userId, String testId, Map<String, Integer> answers) {
        List<Map<String, Object>> questions = mockQuestions(testId);
        int correct = 0;
        for (Map<String, Object> question : questions) {
            Integer selected = answers.get((String) question.get("id"));
            if (selected != null && selected.equals(question.get("correctAnswer"))) correct++;
        }
        int score = questions.isEmpty() ? 0 : Math.round(correct * 100f / questions.size());
        jdbc.update("""
                insert into mock_test_attempts (user_id,test_id,answers,score,total_questions,correct_answers)
                values (?,?,?::jsonb,?,?,?)
                """, userId, testId, toJson(answers), score, questions.size(), correct);
        return map().put("score", score).put("totalQuestions", questions.size()).put("correct", correct).put("attempted", answers.size()).done();
    }

    public List<Map<String, Object>> mockHistory(UUID userId) {
        if (userId == null) return List.of();
        return jdbc.query("""
                select t.title,a.score,a.completed_at
                from mock_test_attempts a join mock_tests t on t.id=a.test_id
                where a.user_id=? order by a.completed_at desc limit 5
                """, (rs, rowNum) -> map().put("title", rs.getString("title")).put("score", rs.getInt("score")).put("when", "Completed recently").done(), userId);
    }

    public Map<String, Object> latestMockAttempt(UUID userId, String testId) {
        if (userId == null) return null;
        return jdbc.query("""
                select answers::text,score,total_questions,correct_answers,completed_at
                from mock_test_attempts where user_id=? and test_id=?
                order by completed_at desc limit 1
                """, rs -> rs.next() ? map()
                .put("answers", jsonMap(rs.getString("answers")))
                .put("score", rs.getInt("score"))
                .put("totalQuestions", rs.getInt("total_questions"))
                .put("correct", rs.getInt("correct_answers"))
                .put("completedAt", rs.getString("completed_at"))
                .done() : null, userId, testId);
    }

    public void createMockTest(String id, String title, String type, String category, String difficulty,
                               int durationMinutes, boolean isFree, List<String> sections, int marksPerQuestion) {
        jdbc.update("""
                insert into mock_tests (id, title, type, category, difficulty, duration_minutes, is_free, sections, marks_per_question)
                values (?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?)
                on conflict (id) do update set
                  title = excluded.title,
                  type = excluded.type,
                  category = excluded.category,
                  difficulty = excluded.difficulty,
                  duration_minutes = excluded.duration_minutes,
                  is_free = excluded.is_free,
                  sections = excluded.sections,
                  marks_per_question = excluded.marks_per_question
                """, id, title, type, category, difficulty, durationMinutes, isFree, toJson(sections), marksPerQuestion);
    }

    public void insertMockTestQuestions(String testId, List<Map<String, Object>> questions) {
        jdbc.update("delete from mock_test_questions where test_id = ?", testId);
        int order = 1;
        for (Map<String, Object> q : questions) {
            String qId = (String) q.get("id");
            if (qId == null || qId.isBlank()) {
                qId = testId + "-q" + order;
            }
            String section = (String) q.getOrDefault("section", "General");
            String topic = (String) q.getOrDefault("topic", "General");
            String difficulty = (String) q.getOrDefault("difficulty", "MEDIUM");
            String questionText = (String) q.getOrDefault("question", "");
            Object optionsObj = q.get("options");
            int correctAnswer = 0;
            if (q.get("correctAnswer") instanceof Number num) {
                correctAnswer = num.intValue();
            }
            String explanation = (String) q.getOrDefault("explanation", "");

            jdbc.update("""
                    insert into mock_test_questions (id, test_id, section, topic, difficulty, question, options, correct_answer, explanation, sort_order)
                    values (?, ?, ?, ?, ?, ?, ?::jsonb, ?, ?, ?)
                    """, qId, testId, section, topic, difficulty, questionText, toJson(optionsObj), correctAnswer, explanation, order++);
        }
    }

    public void createCompany(String id, String name, String type, String difficulty, boolean premium, String description, List<String> areas, int modules) {
        jdbc.update("""
                insert into companies (id, name, type, difficulty, premium, description, areas, modules)
                values (?, ?, ?, ?, ?, ?, ?::jsonb, ?)
                on conflict (id) do update set
                  name = excluded.name,
                  type = excluded.type,
                  difficulty = excluded.difficulty,
                  premium = excluded.premium,
                  description = excluded.description,
                  areas = excluded.areas,
                  modules = excluded.modules
                """, id, name, type, difficulty, premium, description, toJson(areas), modules);
    }

    public List<Map<String, Object>> allCompanies() {
        return jdbc.query("select id, name, type, difficulty, premium, description, areas::text as areas, modules from companies order by name",
                (rs, rowNum) -> map().put("id", rs.getString("id")).put("name", rs.getString("name"))
                        .put("type", rs.getString("type")).put("difficulty", rs.getString("difficulty"))
                        .put("premium", rs.getBoolean("premium")).put("description", rs.getString("description"))
                        .put("areas", jsonList(rs.getString("areas"))).put("modules", rs.getInt("modules")).done());
    }

    private int aptitudeCategoryProgress(String categoryId, UUID userId) {
        if (userId == null) return 0;
        Integer value = jdbc.queryForObject("""
                select coalesce(round(100.0 * count(up.question_id) / nullif(count(q.id),0)),0)::int
                from aptitude_topics t left join aptitude_questions q on q.topic_id=t.id
                left join user_aptitude_progress up on up.question_id=q.id and up.user_id=?
                where t.category_id=?
                """, Integer.class, userId, categoryId);
        return value == null ? 0 : value;
    }

    private int aptitudeTopicProgress(String topicId, UUID userId) {
        if (userId == null) return 0;
        Integer value = jdbc.queryForObject("""
                select coalesce(round(100.0 * count(up.question_id) / nullif(count(q.id),0)),0)::int
                from aptitude_questions q left join user_aptitude_progress up on up.question_id=q.id and up.user_id=?
                where q.topic_id=?
                """, Integer.class, userId, topicId);
        return value == null ? 0 : value;
    }

    private UUID userOrNil(UUID userId) {
        return userId == null ? new UUID(0, 0) : userId;
    }

    private List<Object> jsonList(String json) {
        try {
            return objectMapper.readValue(json == null ? "[]" : json, new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private Map<String, Object> jsonMap(String json) {
        try {
            return objectMapper.readValue(json == null ? "{}" : json, new TypeReference<>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            return "{}";
        }
    }

    private MutableMap map() {
        return new MutableMap();
    }

    private static class MutableMap {
        private final Map<String, Object> values = new LinkedHashMap<>();
        MutableMap put(String key, Object value) {
            values.put(key, value);
            return this;
        }
        Map<String, Object> done() {
            return values;
        }
    }
}
