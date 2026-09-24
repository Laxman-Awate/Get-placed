package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public RoadmapController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object progress(HttpServletRequest request) {
        return content.roadmapProgress(currentUser.optionalUserId(request));
    }

    @PatchMapping("/levels/{levelId}")
    public Object updateLevel(@PathVariable int levelId, @RequestBody Map<String, Object> body,
                              HttpServletRequest request) {
        String status = String.valueOf(body.getOrDefault("status", "active"));
        return content.updateRoadmapLevel(currentUser.requiredUserId(request), levelId, status);
    }
}
