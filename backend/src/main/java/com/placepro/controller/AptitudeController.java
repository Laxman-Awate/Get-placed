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
        List<Map<String, Object>> categories = content.aptitudeCategories(currentUser.optionalUserId(request));
        int overall = categories.isEmpty() ? 0 : (int) Math.round(categories.stream().mapToInt(c -> (Integer) c.get("progress")).average().orElse(0));
        return Map.of(
                "overall", overall,
                "attempted", 0,
                "accuracy", 0,
                "categories", categories.stream().map(c -> List.of(c.get("name"), c.get("progress"))).toList()
        );
    }
}
