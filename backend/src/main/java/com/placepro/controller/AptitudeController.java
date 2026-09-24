package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aptitude")
public class AptitudeController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public AptitudeController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping("/categories")
    public Object categories(HttpServletRequest request) {
        return content.aptitudeCategories(currentUser.optionalUserId(request));
    }

    @GetMapping("/categories/{categoryId}/topics")
    public Object topics(@PathVariable String categoryId, HttpServletRequest request) {
        return content.aptitudeTopics(categoryId, currentUser.optionalUserId(request));
    }

    @GetMapping("/topics/{topicId}/questions")
    public Object questions(@PathVariable String topicId) {
        return content.aptitudeQuestions(topicId);
    }

    @GetMapping("/progress")
    public Object progress(HttpServletRequest request) {
        return content.aptitudeStats(currentUser.optionalUserId(request));
    }

    @PostMapping("/topics/{topicId}/attempts")
    public Object submitAttempt(@PathVariable String topicId, @RequestBody java.util.Map<String, Object> body,
                                HttpServletRequest request) {
        String questionId = String.valueOf(body.get("questionId"));
        Integer selected = body.get("selectedAnswer") == null ? null
                : ((Number) body.get("selectedAnswer")).intValue();
        return content.submitAptitudeAttempt(currentUser.requiredUserId(request), questionId, selected);
    }
}
