package com.placepro.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placepro.repository.GeneratedContentRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ContentGenerationService {

    private final GeneratedContentRepository contentRepo;
    private final ObjectMapper objectMapper;

    public ContentGenerationService(GeneratedContentRepository contentRepo, ObjectMapper objectMapper) {
        this.contentRepo = contentRepo;
        this.objectMapper = objectMapper;
    }

    public void generateDrafts(UUID resourceId, Map<String, Object> structured, String title,
                               String category, String companyId, String companyName,
                               boolean genMockTest, boolean genQuiz, boolean genSheet) throws Exception {

        List<Map<String, Object>> questions = (List<Map<String, Object>>) structured.getOrDefault("questions", List.of());
        if (questions.isEmpty()) {
            questions = List.of(
                    Map.of(
                            "id", "q1",
                            "section", "Technical",
                            "topic", "General",
                            "difficulty", "MEDIUM",
                            "question", "Sample question derived from " + title,
                            "options", List.of("Option A", "Option B", "Option C", "Option D"),
                            "correctAnswer", 0,
                            "explanation", "Default explanation for sample question."
                    )
            );
        }

        // If no toggles were explicitly checked, default to Mock Test
        boolean generateAny = genMockTest || genQuiz || genSheet;
        boolean doMockTest = genMockTest || !generateAny;

        // 1. Generate Mock Test Draft
        if (doMockTest) {
            String testTitle = (companyName != null && !companyName.isBlank())
                    ? companyName + " Placement Assessment (" + title + ")"
                    : title + " — Mock Assessment";

            Set<String> sectionsSet = new LinkedHashSet<>();
            for (Map<String, Object> q : questions) {
                String sec = (String) q.getOrDefault("section", "Technical Assessment");
                sectionsSet.add(sec);
            }
            if (sectionsSet.isEmpty()) sectionsSet.add("General Assessment");

            int durationMinutes = Math.max(15, Math.min(90, questions.size() * 2));

            Map<String, Object> mockTestData = new LinkedHashMap<>();
            mockTestData.put("proposedId", generateSlug((companyId != null ? companyId : "test") + "-" + title));
            mockTestData.put("title", testTitle);
            mockTestData.put("type", companyId != null ? "company" : "mixed");
            mockTestData.put("category", category == null ? "COMPANY" : category);
            mockTestData.put("companyId", companyId);
            mockTestData.put("difficulty", "MEDIUM");
            mockTestData.put("durationMinutes", durationMinutes);
            mockTestData.put("isFree", true);
            mockTestData.put("marksPerQuestion", 1);
            mockTestData.put("sections", new ArrayList<>(sectionsSet));
            mockTestData.put("questions", questions);

            contentRepo.create(resourceId, "MOCK_TEST", testTitle, objectMapper.writeValueAsString(mockTestData));
        }

        // 2. Generate Quiz Draft
        if (genQuiz) {
            String quizTitle = title + " Practice Quiz";
            Map<String, Object> quizData = new LinkedHashMap<>();
            quizData.put("title", quizTitle);
            quizData.put("category", category);
            quizData.put("companyId", companyId);
            quizData.put("totalQuestions", questions.size());
            quizData.put("questions", questions);

            contentRepo.create(resourceId, "QUIZ", quizTitle, objectMapper.writeValueAsString(quizData));
        }

        // 3. Generate Sheet Draft
        if (genSheet) {
            String sheetTitle = title + " Revision Sheet";
            Map<String, Object> sheetData = new LinkedHashMap<>();
            sheetData.put("title", sheetTitle);
            sheetData.put("category", category);
            sheetData.put("totalProblems", questions.size());
            sheetData.put("problems", questions);

            contentRepo.create(resourceId, "SHEET", sheetTitle, objectMapper.writeValueAsString(sheetData));
        }
    }

    private String generateSlug(String input) {
        if (input == null) return "test-" + UUID.randomUUID().toString().substring(0, 8);
        String slug = input.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (slug.length() > 60) slug = slug.substring(0, 60);
        return slug + "-" + UUID.randomUUID().toString().substring(0, 6);
    }
}
