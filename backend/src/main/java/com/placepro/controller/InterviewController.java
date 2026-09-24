package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public InterviewController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping("/questions")
    public Object questions(@RequestParam(required = false) String category) {
        return content.interviewQuestions(category);
    }

    @GetMapping("/stats")
    public Object stats(HttpServletRequest request) {
        return content.interviewStats(currentUser.optionalUserId(request));
    }

    @PostMapping("/attempts")
    public Object attempt(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        String questionId = String.valueOf(body.getOrDefault("questionId", ""));
        String answer = String.valueOf(body.getOrDefault("answer", ""));
        String feedback = String.valueOf(body.getOrDefault("feedback", ""));
        if (questionId.isBlank()) {
            throw new com.placepro.exception.ApiException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "questionId is required.");
        }
        return content.saveInterviewAttempt(currentUser.requiredUserId(request), questionId, answer, feedback);
    }
}
