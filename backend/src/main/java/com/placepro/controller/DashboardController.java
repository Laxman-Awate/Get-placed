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
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public DashboardController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object dashboard(HttpServletRequest request) {
        var userId = currentUser.optionalUserId(request);
        var dsaProblems = content.dsaProblems(userId);
        long solved = dsaProblems.stream().filter(p -> Boolean.TRUE.equals(p.get("solved"))).count();
        List<Map<String, Object>> stats = List.of(
                Map.of("label", "Questions Solved", "value", String.valueOf(solved), "change", "From your saved progress", "icon", "⌘", "tone", "blue"),
                Map.of("label", "Mock Tests", "value", String.valueOf(content.mockHistory(userId).size()), "change", "Completed attempts", "icon", "◉", "tone", "purple"),
                Map.of("label", "Average Score", "value", "0%", "change", "Start a mock test", "icon", "◒", "tone", "teal"),
                Map.of("label", "Learning Progress", "value", "0%", "change", "Keep learning", "icon", "↗", "tone", "amber")
        );
        return Map.of(
                "stats", stats,
                "recentActivity", List.of(),
                "course", Map.of("title", "Data Structures & Algorithms", "progress", dsaProblems.isEmpty() ? 0 : Math.round(solved * 100f / dsaProblems.size()), "next", "Binary Search")
        );
    }
}
