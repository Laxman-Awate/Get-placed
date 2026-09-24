package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Code execution proxy. Tries the Piston API when configured, otherwise
 * returns a local echo result so the Coding workspace Run/Submit buttons
 * work even without external credentials. Every run is logged.
 */
@RestController
@RequestMapping("/api/code")
public class CodeExecutionController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public CodeExecutionController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @PostMapping("/execute")
    public Object execute(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        String language = String.valueOf(body.getOrDefault("language", "python"));
        String source = String.valueOf(body.getOrDefault("source", ""));
        String problemId = body.get("problemId") == null ? null : String.valueOf(body.get("problemId"));
        if (source.isBlank()) {
            throw new com.placepro.exception.ApiException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "source code is required.");
        }
        String output = "Executed " + source.lines().count() + " line(s) in " + language
                + ". Connect PISTON_API_URL for real sandboxed execution.";
        String status = "ok";
        try {
            String piston = System.getenv().getOrDefault("PISTON_API_URL", "");
            if (!piston.isBlank()) {
                output = runViaPiston(piston, language, source);
            }
        } catch (Exception e) {
            status = "error";
            output = "Execution failed: " + e.getMessage();
        }
        return content.logCodeExecution(
                currentUser.optionalUserId(request), problemId, language, source, status, output);
    }

    private String runViaPiston(String baseUrl, String language, String source) throws Exception {
        var client = java.net.http.HttpClient.newHttpClient();
        String payload = "{\"language\":\"" + language + "\",\"version\":\"*\",\"files\":[{\"content\":"
                + com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(source)
                + "}]}";
        var req = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create(baseUrl + "/api/v2/execute"))
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(payload))
                .timeout(java.time.Duration.ofSeconds(15))
                .build();
        var res = client.send(req, java.net.http.HttpResponse.BodyHandlers.ofString());
        return res.body();
    }
}
