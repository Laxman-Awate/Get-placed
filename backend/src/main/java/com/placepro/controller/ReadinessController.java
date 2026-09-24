package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/readiness")
public class ReadinessController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;
    private final JdbcTemplate jdbc;

    public ReadinessController(ContentRepository content, CurrentUserService currentUser, JdbcTemplate jdbc) {
        this.content = content;
        this.currentUser = currentUser;
        this.jdbc = jdbc;
    }

    @GetMapping
    public Object readiness(HttpServletRequest request) {
        var userId = currentUser.optionalUserId(request);

        var dsa = content.dsaProblems(userId);
        int dsaScore = dsa.isEmpty() ? 0 : Math.round((float) dsa.stream().filter(p -> Boolean.TRUE.equals(p.get("solved"))).count() * 100 / dsa.size());

        var coding = content.codingProblems(userId);
        int codingScore = coding.isEmpty() ? 0 : Math.round((float) coding.stream().filter(p -> Boolean.TRUE.equals(p.get("solved"))).count() * 100 / coding.size());

        int aptitudeScore = 0;
        if (userId != null) {
            Integer v = jdbc.queryForObject("""
                    select coalesce(round(100.0 * count(up.question_id) / nullif(count(q.id),0)),0)::int
                    from aptitude_questions q left join user_aptitude_progress up on up.question_id=q.id and up.user_id=?
                    """, Integer.class, userId);
            aptitudeScore = v == null ? 0 : v;
        }

        var history = content.mockHistory(userId);
        int mockScore = history.isEmpty() ? 0
                : (int) Math.round(history.stream().mapToInt(h -> ((Number) h.get("score")).intValue()).average().orElse(0));

        int academicsScore = 0;
        int companiesScore = 0;
        if (userId != null) {
            Integer c = jdbc.queryForObject("select count(*) from user_company_progress where user_id=?", Integer.class, userId);
            companiesScore = (c == null || c == 0) ? 0 : Math.min(100, c * 20);
            Integer total = jdbc.queryForObject("select count(*) from subject_topics", Integer.class);
            Integer done = jdbc.queryForObject(
                    "select count(*) from user_learning_progress where user_id=? and complete=true and content_type in ('topic','lesson')",
                    Integer.class, userId);
            if (total != null && total > 0 && done != null) {
                academicsScore = Math.min(100, Math.round(done * 100f / total));
            }
        }

        return List.of(
                Map.of("key", "dsa", "label", "DSA", "score", dsaScore, "explanation", dsaScore == 0 ? "Solve DSA sheet problems to build this score." : "Based on solved DSA sheet problems.", "route", "/practice/dsa"),
                Map.of("key", "aptitude", "label", "Aptitude", "score", aptitudeScore, "explanation", aptitudeScore == 0 ? "Practice aptitude questions to build this score." : "Based on solved aptitude questions.", "route", "/practice/aptitude"),
                Map.of("key", "coding", "label", "Coding", "score", codingScore, "explanation", codingScore == 0 ? "Solve coding problems to build this score." : "Based on solved coding problems.", "route", "/coding"),
                Map.of("key", "academics", "label", "Academics", "score", academicsScore, "explanation", "Complete lessons to improve academic readiness.", "route", "/learning"),
                Map.of("key", "mockTests", "label", "Mock Tests", "score", mockScore, "explanation", mockScore == 0 ? "Complete mock tests to build confidence." : "Average across recent mock attempts.", "route", "/mock-tests"),
                Map.of("key", "companies", "label", "Company Preparation", "score", companiesScore, "explanation", companiesScore == 0 ? "Explore a target-company roadmap next." : "Based on companies you track.", "route", "/companies"));
    }
}
