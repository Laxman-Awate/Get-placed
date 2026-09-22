package com.placepro.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placepro.exception.ApiException;
import com.placepro.repository.AdminResourceRepository;
import com.placepro.repository.ContentRepository;
import com.placepro.repository.GeneratedContentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ContentPublishingService {

    private final GeneratedContentRepository generatedContentRepo;
    private final AdminResourceRepository resourceRepo;
    private final ContentRepository contentRepo;
    private final ObjectMapper objectMapper;

    public ContentPublishingService(GeneratedContentRepository generatedContentRepo,
                                    AdminResourceRepository resourceRepo,
                                    ContentRepository contentRepo,
                                    ObjectMapper objectMapper) {
        this.generatedContentRepo = generatedContentRepo;
        this.resourceRepo = resourceRepo;
        this.contentRepo = contentRepo;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public Map<String, Object> publish(UUID contentId) {
        Map<String, Object> contentItem = generatedContentRepo.findById(contentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Generated content draft not found."));

        String contentType = (String) contentItem.get("contentType");
        UUID resourceId = (UUID) contentItem.get("resourceId");
        Object dataObj = contentItem.get("data");

        Map<String, Object> data = dataObj instanceof Map<?, ?> m ? (Map<String, Object>) m : Map.of();
        String targetEntityId = null;

        if ("MOCK_TEST".equalsIgnoreCase(contentType)) {
            String proposedId = (String) data.getOrDefault("proposedId", "test-" + UUID.randomUUID().toString().substring(0, 8));
            String title = (String) data.getOrDefault("title", contentItem.get("title"));
            String type = (String) data.getOrDefault("type", "company");
            String category = (String) data.getOrDefault("category", "COMPANY");
            String difficulty = (String) data.getOrDefault("difficulty", "MEDIUM");
            int durationMinutes = ((Number) data.getOrDefault("durationMinutes", 45)).intValue();
            boolean isFree = Boolean.TRUE.equals(data.get("isFree"));
            int marksPerQuestion = ((Number) data.getOrDefault("marksPerQuestion", 1)).intValue();

            List<String> sections = new ArrayList<>();
            if (data.get("sections") instanceof List<?> secList) {
                for (Object s : secList) {
                    if (s != null) sections.add(s.toString());
                }
            }
            if (sections.isEmpty()) sections.add("General Assessment");

            // 1. Create or update mock test row
            contentRepo.createMockTest(proposedId, title, type, category, difficulty, durationMinutes, isFree, sections, marksPerQuestion);

            // 2. Insert questions
            List<Map<String, Object>> questions = (List<Map<String, Object>>) data.getOrDefault("questions", List.of());
            contentRepo.insertMockTestQuestions(proposedId, questions);

            targetEntityId = proposedId;
        } else {
            // QUIZ or SHEET drafts can also be approved
            targetEntityId = "draft-" + contentId;
        }

        // 3. Mark generated content as PUBLISHED
        generatedContentRepo.updateStatus(contentId, "PUBLISHED", targetEntityId);

        // 4. Mark resource as PUBLISHED
        resourceRepo.updateStatus(resourceId, "PUBLISHED", null);

        return Map.of(
                "contentId", contentId,
                "resourceId", resourceId,
                "status", "PUBLISHED",
                "targetEntityId", targetEntityId,
                "message", "Successfully published to live student catalog."
        );
    }
}
