package com.placepro.controller;

import com.placepro.exception.ApiException;
import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashSet;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/coding")
public class CodingController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public CodingController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping("/problems")
    public Object problems(HttpServletRequest request) {
        return content.codingProblems(currentUser.optionalUserId(request));
    }

    @GetMapping("/problems/{id}")
    public Object problem(@PathVariable String id, HttpServletRequest request) {
        return content.codingProblem(id, currentUser.optionalUserId(request))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Coding problem not found."));
    }

    @GetMapping("/topics")
    public Object topics(HttpServletRequest request) {
        LinkedHashSet<Object> topics = new LinkedHashSet<>();
        content.codingProblems(currentUser.optionalUserId(request)).forEach(problem -> topics.add(problem.get("topic")));
        return topics;
    }

    @GetMapping("/home")
    public Object home(HttpServletRequest request) {
        var problems = content.codingProblems(currentUser.optionalUserId(request));
        long solved = problems.stream().filter(p -> Boolean.TRUE.equals(p.get("solved"))).count();
        Map<String, Object> stats = Map.of("solved", solved, "attempted", solved, "accuracy", solved > 0 ? 100 : 0, "streak", 0);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("continueProblem", problems.size() > 1 ? problems.get(1) : (problems.isEmpty() ? null : problems.get(0)));
        body.put("recommended", problems.stream().limit(4).toList());
        body.put("topics", topics(request));
        return body;
    }

    @PatchMapping("/problems/{id}/progress")
    public Object progress(@PathVariable String id, @RequestBody Map<String, Boolean> body, HttpServletRequest request) {
        return content.upsertCodingProgress(currentUser.requiredUserId(request), id, body.get("solved"), body.get("bookmarked"));
    }
}
