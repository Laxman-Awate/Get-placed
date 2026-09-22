package com.placepro.controller;

import com.placepro.exception.ApiException;
import com.placepro.repository.AdminResourceRepository;
import com.placepro.repository.ContentRepository;
import com.placepro.repository.GeneratedContentRepository;
import com.placepro.service.CurrentUserService;
import com.placepro.service.FileStorageService;
import com.placepro.service.ResourceParsingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/admin/resources")
@PreAuthorize("hasRole('ADMIN')")
public class AdminResourceController {

    private final AdminResourceRepository resourceRepo;
    private final GeneratedContentRepository contentRepo;
    private final ContentRepository mainContentRepo;
    private final FileStorageService fileStorageService;
    private final ResourceParsingService parsingService;
    private final CurrentUserService currentUserService;

    public AdminResourceController(AdminResourceRepository resourceRepo,
                                   GeneratedContentRepository contentRepo,
                                   ContentRepository mainContentRepo,
                                   FileStorageService fileStorageService,
                                   ResourceParsingService parsingService,
                                   CurrentUserService currentUserService) {
        this.resourceRepo = resourceRepo;
        this.contentRepo = contentRepo;
        this.mainContentRepo = mainContentRepo;
        this.fileStorageService = fileStorageService;
        this.parsingService = parsingService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(resourceRepo.getDashboardStats());
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        List<Map<String, Object>> resources = resourceRepo.findAll(category, status, limit, offset);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("resources", resources);
        response.put("stats", resourceRepo.getDashboardStats());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable UUID id) {
        Map<String, Object> resource = resourceRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Admin resource not found: " + id));

        List<Map<String, Object>> drafts = contentRepo.findByResourceId(id);
        Map<String, Object> result = new LinkedHashMap<>(resource);
        result.put("generatedContent", drafts);
        return ResponseEntity.ok(result);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> uploadResource(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "rawText", required = false) String rawText,
            @RequestParam("title") String title,
            @RequestParam(value = "resourceType", defaultValue = "PDF_COMPANY_QUESTIONS") String resourceType,
            @RequestParam(value = "category", defaultValue = "COMPANY") String category,
            @RequestParam(value = "companyId", required = false) String companyId,
            @RequestParam(value = "generateMockTest", defaultValue = "true") boolean generateMockTest,
            @RequestParam(value = "generateQuiz", defaultValue = "false") boolean generateQuiz,
            @RequestParam(value = "generateSheet", defaultValue = "false") boolean generateSheet,
            HttpServletRequest request) throws IOException {

        if ((file == null || file.isEmpty()) && (rawText == null || rawText.isBlank())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please provide either an uploaded file or paste raw text.");
        }

        UUID userId = currentUserService.optionalUserId(request);
        String filePath = null;
        String fileName = null;
        Long fileSize = null;

        if (file != null && !file.isEmpty()) {
            filePath = fileStorageService.store(file);
            fileName = file.getOriginalFilename();
            fileSize = file.getSize();
        } else {
            fileName = title.replaceAll("[^a-zA-Z0-9.-]", "_") + ".txt";
            filePath = fileStorageService.storeText(fileName, rawText);
            fileSize = (long) rawText.getBytes().length;
        }

        String companyName = null;
        if (companyId != null && !companyId.isBlank()) {
            companyName = mainContentRepo.companies(userId).stream()
                    .filter(c -> companyId.equals(c.get("id")))
                    .map(c -> (String) c.get("name"))
                    .findFirst().orElse(companyId);
        }

        UUID resourceId = resourceRepo.create(
                userId, title.trim(), resourceType, category, companyId, filePath, fileName, fileSize, rawText
        );

        // Kick off async parsing and generation
        parsingService.processResourceAsync(
                resourceId, filePath, title.trim(), resourceType, category, companyId, companyName,
                generateMockTest, generateQuiz, generateSheet
        );

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("resourceId", resourceId);
        resp.put("status", "UPLOADED");
        resp.put("message", "Resource uploaded successfully. Processing started in background.");
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(resp);
    }

    @PostMapping("/{id}/reprocess")
    public ResponseEntity<Map<String, Object>> reprocess(
            @PathVariable UUID id,
            @RequestParam(value = "generateMockTest", defaultValue = "true") boolean generateMockTest,
            @RequestParam(value = "generateQuiz", defaultValue = "false") boolean generateQuiz,
            @RequestParam(value = "generateSheet", defaultValue = "false") boolean generateSheet) {

        Map<String, Object> resource = resourceRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Resource not found: " + id));

        String filePath = (String) resource.get("filePath");
        String title = (String) resource.get("title");
        String resourceType = (String) resource.get("resourceType");
        String category = (String) resource.get("category");
        String companyId = (String) resource.get("companyId");
        String companyName = (String) resource.get("companyName");

        parsingService.processResourceAsync(
                id, filePath, title, resourceType, category, companyId, companyName,
                generateMockTest, generateQuiz, generateSheet
        );

        return ResponseEntity.ok(Map.of("resourceId", id, "status", "REPROCESSING", "message", "Reprocessing started."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        boolean deleted = resourceRepo.delete(id);
        if (!deleted) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Resource not found: " + id);
        }
        return ResponseEntity.noContent().build();
    }
}
