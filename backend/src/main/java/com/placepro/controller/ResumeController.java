package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public ResumeController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object get(HttpServletRequest request) {
        return content.getResume(currentUser.requiredUserId(request));
    }

    @PutMapping
    @SuppressWarnings("unchecked")
    public Object save(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Object data = body.getOrDefault("data", body);
        Map<String, Object> resume = data instanceof Map ? (Map<String, Object>) data : Map.of();
        return content.saveResume(currentUser.requiredUserId(request), resume);
    }
}
