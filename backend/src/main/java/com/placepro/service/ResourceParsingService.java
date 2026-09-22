package com.placepro.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placepro.repository.AdminResourceRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
public class ResourceParsingService {

    private static final Logger log = LoggerFactory.getLogger(ResourceParsingService.class);

    private final AdminResourceRepository resourceRepo;
    private final LlmService llmService;
    private final ContentGenerationService contentGenService;
    private final ObjectMapper objectMapper;

    public ResourceParsingService(AdminResourceRepository resourceRepo,
                                  LlmService llmService,
                                  ContentGenerationService contentGenService,
                                  ObjectMapper objectMapper) {
        this.resourceRepo = resourceRepo;
        this.llmService = llmService;
        this.contentGenService = contentGenService;
        this.objectMapper = objectMapper;
    }

    @Async
    public void processResourceAsync(UUID resourceId, String filePath, String title,
                                     String resourceType, String category, String companyId,
                                     String companyName, boolean genMockTest, boolean genQuiz, boolean genSheet) {
        log.info("Starting async extraction pipeline for resource ID: {} ('{}')", resourceId, title);
        try {
            // 1. Update status to PARSING
            resourceRepo.updateStatus(resourceId, "PARSING", null);

            // 2. Extract raw text from file
            String rawText = extractRawText(filePath);
            resourceRepo.updateRawText(resourceId, rawText);

            // 3. LLM Question Structuring
            log.info("Extracting structured questions via LLM for resource ID: {}", resourceId);
            Map<String, Object> structured = llmService.structureQuestions(rawText, title, category, companyName);
            String parsedJson = objectMapper.writeValueAsString(structured);

            resourceRepo.updateParsedJson(resourceId, parsedJson, "PARSED");

            // 4. Content Generation
            resourceRepo.updateStatus(resourceId, "GENERATING", null);
            log.info("Generating drafts (MockTest: {}, Quiz: {}, Sheet: {}) for resource ID: {}",
                    genMockTest, genQuiz, genSheet, resourceId);

            contentGenService.generateDrafts(resourceId, structured, title, category, companyId, companyName,
                    genMockTest, genQuiz, genSheet);

            // 5. Ready for review
            resourceRepo.updateStatus(resourceId, "REVIEW", null);
            log.info("Resource processing complete. Status set to REVIEW for ID: {}", resourceId);

        } catch (Exception e) {
            log.error("Pipeline failure for resource ID: {}", resourceId, e);
            resourceRepo.updateStatus(resourceId, "FAILED", e.getMessage());
        }
    }

    public String extractRawText(String filePath) throws Exception {
        if (filePath == null || filePath.isBlank()) {
            return "";
        }
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IllegalArgumentException("File not found at path: " + filePath);
        }

        String lower = filePath.toLowerCase();
        if (lower.endsWith(".pdf")) {
            try (PDDocument document = Loader.loadPDF(file)) {
                PDFTextStripper stripper = new PDFTextStripper();
                stripper.setSortByPosition(true);
                return stripper.getText(document);
            }
        } else {
            // Plain text, markdown, CSV, or json
            return Files.readString(Path.of(filePath));
        }
    }
}
