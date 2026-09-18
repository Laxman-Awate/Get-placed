package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
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

    public ReadinessController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object readiness(HttpServletRequest request) {
        var userId = currentUser.optionalUserId(request);
        var dsa = content.dsaProblems(userId);
        int dsaScore = dsa.isEmpty() ? 0 : Math.round((float) dsa.stream().filter(p -> Boolean.TRUE.equals(p.get("solved"))).count() * 100 / dsa.size());
        return List.of(
                Map.of("key", "dsa", "label", "DSA", "score", dsaScore, "explanation", "Based on solved DSA sheet problems.", "route", "/practice/dsa"),
                Map.of("key", "aptitude", "label", "Aptitude", "score", 0, "explanation", "Practice aptitude questions to build this score.", "route", "/practice/aptitude"),
                Map.of("key", "coding", "label", "Coding", "score", dsaScore, "explanation", "Based on solved coding problems.", "route", "/coding"),
                Map.of("key", "academics", "label", "Academics", "score", 0, "explanation", "Complete lessons to improve academic readiness.", "route", "/learning"),
                Map.of("key", "mockTests", "label", "Mock Tests", "score", 0, "explanation", "Complete mock tests to build confidence.", "route", "/mock-tests"),
                Map.of("key", "companies", "label", "Company Preparation", "score", 0, "explanation", "Explore a target-company roadmap next.", "route", "/companies")
        );
    }
}
