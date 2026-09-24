package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning")
public class LearningController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public LearningController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object learning(HttpServletRequest request) {
        return content.learning(currentUser.optionalUserId(request));
    }

    @PostMapping("/progress")
    public Object updateProgress(@RequestBody java.util.Map<String, Object> body,
                                 HttpServletRequest request) {
        String contentType = String.valueOf(body.getOrDefault("contentType", "topic"));
        String contentId = String.valueOf(body.getOrDefault("contentId", ""));
        boolean complete = Boolean.TRUE.equals(body.get("complete"));
        if (contentId.isBlank()) {
            throw new com.placepro.exception.ApiException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "contentId is required.");
        }
        return content.upsertLearningProgress(
                currentUser.requiredUserId(request), contentType, contentId, complete);
    }
}
