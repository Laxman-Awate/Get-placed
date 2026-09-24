package com.placepro.controller;

import com.placepro.exception.ApiException;
import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dsa")
public class DsaController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public DsaController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping("/sheet")
    public Map<String, Object> sheet(HttpServletRequest request) {
        return Map.of("topics", content.dsaTopics(), "problems", content.dsaProblems(currentUser.optionalUserId(request)));
    }

    @GetMapping("/problems")
    public Object problems(HttpServletRequest request) {
        return content.dsaProblems(currentUser.optionalUserId(request));
    }

    @GetMapping("/problems/{id}")
    public Object problem(@PathVariable String id, HttpServletRequest request) {
        return content.dsaProblem(id, currentUser.optionalUserId(request))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "DSA problem not found."));
    }

    @GetMapping("/problems/{id}/testcases")
    public Object testCases(@PathVariable String id) {
        content.dsaProblem(id, null)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "DSA problem not found."));
        return content.dsaTestCases(id);
    }

    @PatchMapping("/problems/{id}/progress")
    public Object progress(@PathVariable String id, @RequestBody Map<String, Boolean> body, HttpServletRequest request) {
        return content.upsertDsaProgress(currentUser.requiredUserId(request), id, body.get("solved"), body.get("bookmarked"));
    }
}
