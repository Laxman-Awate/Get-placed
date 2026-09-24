package com.placepro.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.placepro.exception.ApiException;
import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Code execution proxy. Raw runs go through {@code POST /execute}; judged
 * submissions (LeetCode-style, every sample + hidden case) go through
 * {@code POST /submit}. Execution itself runs in the Piston sandbox.
 */
@RestController
@RequestMapping("/api/code")
public class CodeExecutionController {
    private static final Duration PISTON_TIMEOUT = Duration.ofSeconds(30);

    private final ContentRepository content;
    private final CurrentUserService currentUser;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Map<String, String> pistonVersions = new ConcurrentHashMap<>();

    public CodeExecutionController(ContentRepository content, CurrentUserService currentUser,
                                   ObjectMapper objectMapper) {
        this.content = content;
        this.currentUser = currentUser;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/execute")
    public Object execute(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        String language = String.valueOf(body.getOrDefault("language", "python"));
        String source = String.valueOf(body.getOrDefault("source", ""));
        String problemId = body.get("problemId") == null ? null : String.valueOf(body.get("problemId"));
        if (source.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "source code is required.");
        }
        String output;
        String status = "ok";
        try {
            output = runOnPiston(language, source, null).output;
        } catch (Exception e) {
            status = "error";
            output = "Execution failed: " + e.getMessage();
        }
        return content.logCodeExecution(
                currentUser.optionalUserId(request), problemId, language, source, status, output);
    }

    /**
     * Judges {@code source} against the problem's test cases and returns a
     * per-case verdict, like LeetCode. {@code samplesOnly=true} judges just
     * the visible samples (used by Run); otherwise every case runs and
     * judging stops at the first failure.
     */
    @PostMapping("/submit")
    public Object submit(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        String problemId = body.get("problemId") == null ? null : String.valueOf(body.get("problemId"));
        String language = String.valueOf(body.getOrDefault("language", "python"));
        String source = String.valueOf(body.getOrDefault("source", ""));
        boolean samplesOnly = Boolean.TRUE.equals(body.get("samplesOnly"));
        if (problemId == null || problemId.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "problemId is required.");
        }
        if (source.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "source code is required.");
        }
        content.dsaProblem(problemId, null)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "DSA problem not found."));
        List<Map<String, Object>> cases = content.dsaTestCasesForJudging(problemId);
        if (samplesOnly) {
            cases = cases.stream().filter(c -> Boolean.TRUE.equals(c.get("sample"))).toList();
        }
        if (cases.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No test cases for this problem yet.");
        }

        List<Map<String, Object>> results = new ArrayList<>();
        int passed = 0;
        String status = "accepted";
        for (Map<String, Object> testCase : cases) {
            boolean sample = Boolean.TRUE.equals(testCase.get("sample"));
            String expected = String.valueOf(testCase.getOrDefault("expected", ""));
            String stdin = (String) testCase.getOrDefault("stdin", "");
            RunResult run;
            try {
                run = runOnPiston(language, source, stdin);
            } catch (Exception e) {
                throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                        "Execution engine unreachable: " + e.getMessage());
            }
            boolean ok = run.exitCode == 0 && normalize(run.output).equals(normalize(expected));
            if (ok) {
                passed++;
            } else {
                status = "wrong_answer";
            }
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("order", testCase.get("order"));
            result.put("sample", sample);
            result.put("input", testCase.get("input"));
            result.put("passed", ok);
            if (sample) {
                result.put("expected", expected);
                result.put("actual", run.output);
            } else if (!ok) {
                result.put("actual", run.output);
            }
            results.add(result);
            if (!ok && !samplesOnly) {
                break; // stop at the first failure, like LeetCode
            }
        }

        content.logCodeExecution(currentUser.optionalUserId(request), problemId, language, source,
                status, "Passed " + passed + "/" + cases.size() + " test cases.");
        return Map.of("status", status, "passed", passed, "total", cases.size(), "results", results);
    }

    private String pistonBaseUrl() {
        String configured = System.getenv("PISTON_API_URL");
        if (configured != null && !configured.isBlank()) return configured;
        String prop = System.getProperty("PISTON_API_URL");
        if (prop != null && !prop.isBlank()) return prop;
        return "https://emkc.org/api/v2";
    }

    private String pistonLanguage(String language) {
        return switch (language) {
            case "cpp", "c++" -> "c++";
            case "c" -> "c";
            case "java" -> "java";
            case "javascript" -> "javascript";
            default -> "python";
        };
    }

    private String fileName(String language) {
        return switch (pistonLanguage(language)) {
            case "java" -> "Main.java";
            case "c++" -> "solution.cpp";
            case "c" -> "solution.c";
            case "javascript" -> "solution.js";
            default -> "solution.py";
        };
    }

    private String pistonVersion(String language) {
        String key = pistonLanguage(language);
        String cached = pistonVersions.get(key);
        if (cached != null) return cached;
        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(pistonBaseUrl() + "/api/v2/runtimes"))
                    .timeout(Duration.ofSeconds(10))
                    .GET().build();
            JsonNode runtimes = objectMapper.readTree(
                    httpClient.send(req, HttpResponse.BodyHandlers.ofString()).body());
            for (JsonNode runtime : runtimes) {
                String name = runtime.path("language").asText();
                boolean match = name.equalsIgnoreCase(key);
                if (!match) {
                    for (JsonNode alias : runtime.path("aliases")) {
                        if (alias.asText().equalsIgnoreCase(key)) {
                            match = true;
                            break;
                        }
                    }
                }
                if (match) {
                    String version = runtime.path("version").asText("*");
                    pistonVersions.put(key, version);
                    return version;
                }
            }
        } catch (Exception ignored) {
        }
        return "*";
    }

    private RunResult runOnPiston(String language, String source, String stdin) throws Exception {
        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("language", pistonLanguage(language));
        payload.put("version", pistonVersion(language));
        ArrayNode files = payload.putArray("files");
        ObjectNode file = files.addObject();
        file.put("name", fileName(language));
        file.put("content", source);
        payload.put("stdin", stdin == null ? "" : stdin);
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(pistonBaseUrl() + "/api/v2/execute"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                .timeout(PISTON_TIMEOUT)
                .build();
        JsonNode res = objectMapper.readTree(
                httpClient.send(req, HttpResponse.BodyHandlers.ofString()).body());
        if (res.has("message")) {
            throw new IllegalStateException(res.path("message").asText("execution rejected"));
        }
        JsonNode run = res.path("run");
        String stdout = run.path("stdout").asText("");
        String stderr = run.path("stderr").asText("");
        int code = run.path("code").asInt(0);
        String output = stdout.isEmpty() && !stderr.isEmpty() ? stderr : stdout;
        return new RunResult(code, output.length() > 4000 ? output.substring(0, 4000) : output);
    }

    private static String normalize(String value) {
        return value == null ? "" : value.replaceAll("\\s+", "");
    }

    private record RunResult(int exitCode, String output) {
    }
}
