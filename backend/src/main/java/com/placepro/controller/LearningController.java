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
}
