package com.placepro.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placepro.exception.ApiException;
import com.placepro.repository.GeneratedContentRepository;
import com.placepro.service.ContentPublishingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/generated-content")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContentController {

    private final GeneratedContentRepository contentRepo;
    private final ContentPublishingService publishingService;
    private final ObjectMapper objectMapper;

    public AdminContentController(GeneratedContentRepository contentRepo,
                                  ContentPublishingService publishingService,
                                  ObjectMapper objectMapper) {
        this.contentRepo = contentRepo;
        this.publishingService = publishingService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable UUID id) {
        Map<String, Object> item = contentRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Generated content draft not found: " + id));
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateDraft(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> payload) throws Exception {

        String title = (String) payload.get("title");
        Object dataObj = payload.get("data");
        String dataJson = objectMapper.writeValueAsString(dataObj != null ? dataObj : payload);

        contentRepo.updateDraft(id, title, dataJson);

        Map<String, Object> updated = contentRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Generated content draft not found: " + id));
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveAndPublish(@PathVariable UUID id) {
        Map<String, Object> result = publishingService.publish(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> reject(@PathVariable UUID id) {
        contentRepo.updateStatus(id, "REJECTED", null);
        return ResponseEntity.ok(Map.of("id", id, "status", "REJECTED", "message", "Draft rejected."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        boolean deleted = contentRepo.delete(id);
        if (!deleted) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Generated content not found: " + id);
        }
        return ResponseEntity.noContent().build();
    }
}
