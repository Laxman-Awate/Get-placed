package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
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
        int dsaProgress = dsaProblems.isEmpty() ? 0 : Math.round(solved * 100f / dsaProblems.size());

        var history = content.mockHistory(userId);
        int avgScore = history.isEmpty() ? 0
                : (int) Math.round(history.stream()
                        .mapToInt(h -> ((Number) h.get("score")).intValue())
                        .average().orElse(0));

        List<Map<String, Object>> recentActivity = new ArrayList<>();
        for (Map<String, Object> h : history) {
            recentActivity.add(Map.of(
                    "icon", "◉",
                    "title", String.valueOf(h.get("title")),
                    "meta", "Mock test · Scored " + h.get("score") + "%",
                    "tone", "purple"));
        }
        if (solved > 0) {
            recentActivity.add(0, Map.of(
                    "icon", "✓",
                    "title", solved + " DSA questions solved",
                    "meta", "DSA · " + dsaProgress + "% complete",
                    "tone", "green"));
        }

        List<Map<String, Object>> stats = List.of(
                Map.of("label", "Questions Solved", "value", String.valueOf(solved),
                        "change", dsaProblems.isEmpty() ? "No problems yet" : dsaProgress + "% of DSA sheet",
                        "icon", "⌘", "tone", "blue"),
                Map.of("label", "Mock Tests", "value", String.valueOf(history.size()),
                        "change", history.isEmpty() ? "Take your first test" : "Completed attempts",
                        "icon", "◉", "tone", "purple"),
                Map.of("label", "Average Score", "value", avgScore + "%",
                        "change", history.isEmpty() ? "Start a mock test" : "Across recent attempts",
                        "icon", "◒", "tone", "teal"),
                Map.of("label", "Learning Progress", "value", dsaProgress + "%",
                        "change", solved == 0 ? "Keep learning" : "DSA sheet progress",
                        "icon", "↗", "tone", "amber"));

        return Map.of(
                "stats", stats,
                "recentActivity", recentActivity,
                "course", Map.of("title", "Data Structures & Algorithms", "progress", dsaProgress,
                        "next", solved >= dsaProblems.size() && !dsaProblems.isEmpty() ? "Mock tests" : "Binary Search"));
    }
}
