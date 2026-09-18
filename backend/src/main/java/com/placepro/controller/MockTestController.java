package com.placepro.controller;

import com.placepro.exception.ApiException;
import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mock-tests")
public class MockTestController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public MockTestController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object tests() {
        return content.mockTests();
    }

    @GetMapping("/{id}")
    public Object test(@PathVariable String id) {
        return content.mockTest(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Mock test not found."));
    }

    @GetMapping("/history")
    public Object history(HttpServletRequest request) {
        return content.mockHistory(currentUser.optionalUserId(request));
    }

    @PostMapping("/{id}/attempts")
    public Object submit(@PathVariable String id, @RequestBody Map<String, Integer> answers, HttpServletRequest request) {
        return content.saveMockAttempt(currentUser.requiredUserId(request), id, answers);
    }

    @GetMapping("/{id}/attempts/latest")
    public Object latest(@PathVariable String id, HttpServletRequest request) {
        Object attempt = content.latestMockAttempt(currentUser.optionalUserId(request), id);
        return attempt == null ? Map.of() : attempt;
    }

    @GetMapping("/summary")
    public Object summary(HttpServletRequest request) {
        var history = content.mockHistory(currentUser.optionalUserId(request));
        int attempted = history.size();
        int best = history.stream().mapToInt(item -> (Integer) item.get("score")).max().orElse(0);
        int avg = attempted == 0 ? 0 : (int) Math.round(history.stream().mapToInt(item -> (Integer) item.get("score")).average().orElse(0));
        return Map.of("attempted", attempted, "bestScore", best, "averageScore", avg, "questionsAttempted", 0);
    }
}
