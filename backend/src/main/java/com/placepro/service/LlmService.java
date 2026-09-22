package com.placepro.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LlmService {

    private static final Logger log = LoggerFactory.getLogger(LlmService.class);

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${llm.provider:auto}")
    private String llmProvider;

    @Value("${llm.api-key:}")
    private String llmApiKey;

    @Value("${anthropic.api-key:}")
    private String anthropicApiKey;

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    public LlmService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
    }

    public Map<String, Object> structureQuestions(String rawText, String title, String category, String companyName) {
        String effectiveAnthropic = anthropicApiKey.isBlank() ? (llmApiKey.startsWith("sk-ant-") ? llmApiKey : "") : anthropicApiKey;
        String effectiveGemini = geminiApiKey.isBlank() ? (llmApiKey.startsWith("AIza") ? llmApiKey : "") : geminiApiKey;

        // 1. Try Anthropic Claude API if configured
        if (!effectiveAnthropic.isBlank()) {
            try {
                log.info("Calling Anthropic Claude API for question extraction...");
                String jsonResponse = callAnthropic(effectiveAnthropic, rawText, title, category, companyName);
                return parseAndSanitize(jsonResponse, rawText, title, category);
            } catch (Exception e) {
                log.warn("Anthropic extraction failed, trying fallbacks: {}", e.getMessage());
            }
        }

        // 2. Try Google Gemini API if configured
        if (!effectiveGemini.isBlank()) {
            try {
                log.info("Calling Gemini API for question extraction...");
                String jsonResponse = callGemini(effectiveGemini, rawText, title, category, companyName);
                return parseAndSanitize(jsonResponse, rawText, title, category);
            } catch (Exception e) {
                log.warn("Gemini extraction failed, falling back to heuristic parser: {}", e.getMessage());
            }
        }

        // 3. Robust Heuristic Rule-Based Fallback Parser (Offline / Local Dev)
        log.info("Using built-in rule-based extractor for '{}' (no external LLM key active)", title);
        return heuristicExtract(rawText, title, category, companyName);
    }

    private String callAnthropic(String apiKey, String rawText, String title, String category, String companyName) throws Exception {
        String prompt = buildPrompt(rawText, title, category, companyName);
        Map<String, Object> body = Map.of(
                "model", "claude-3-5-sonnet-20241022",
                "max_tokens", 4000,
                "system", "You are an expert technical interviewer and placement preparation content curator. " +
                        "Extract all questions from the text into clean, valid JSON strictly matching the requested schema. Return ONLY JSON.",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.anthropic.com/v1/messages"))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                .timeout(Duration.ofSeconds(60))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Anthropic API returned status " + response.statusCode() + ": " + response.body());
        }

        Map<String, Object> respMap = objectMapper.readValue(response.body(), new TypeReference<>() {});
        List<Map<String, Object>> contentList = (List<Map<String, Object>>) respMap.get("content");
        if (contentList != null && !contentList.isEmpty()) {
            return (String) contentList.get(0).get("text");
        }
        throw new RuntimeException("Empty response from Anthropic API");
    }

    private String callGemini(String apiKey, String rawText, String title, String category, String companyName) throws Exception {
        String prompt = buildPrompt(rawText, title, category, companyName);
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
                )
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                .timeout(Duration.ofSeconds(60))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API returned status " + response.statusCode() + ": " + response.body());
        }

        Map<String, Object> respMap = objectMapper.readValue(response.body(), new TypeReference<>() {});
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) respMap.get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts != null && !parts.isEmpty()) {
                return (String) parts.get(0).get("text");
            }
        }
        throw new RuntimeException("Empty response from Gemini API");
    }

    private String buildPrompt(String rawText, String title, String category, String companyName) {
        String truncatedText = rawText.length() > 25000 ? rawText.substring(0, 25000) : rawText;
        return """
                You are analyzing interview/placement preparation material:
                Title: %s
                Category: %s
                Company: %s

                Task: Extract all interview questions, MCQs, or problem statements from the text below.
                Format rules:
                1. If a question is multiple-choice, extract all options cleanly in an array.
                2. Identify the correct answer (0-indexed integer corresponding to the options array index, e.g., 0 for A, 1 for B, 2 for C, 3 for D).
                3. If no options are present in the text, generate 4 plausible multiple-choice options with 1 correct answer.
                4. Include a concise, helpful explanation for why the answer is correct.
                5. Assign an appropriate topic tag (e.g., 'Arrays', 'Pointers', 'Probability', 'DBMS', 'OOP', 'General Technical').
                6. Assign a difficulty: 'EASY', 'MEDIUM', or 'HARD'.
                7. Group into sections: 'Aptitude', 'Technical MCQ', 'Coding', or 'Core CS'.

                Output MUST be strict JSON in this exact structure:
                {
                  "title": "%s",
                  "category": "%s",
                  "summary": "Brief 1-2 sentence overview of the extracted questions",
                  "questions": [
                    {
                      "id": "q1",
                      "section": "Technical MCQ",
                      "topic": "Data Structures",
                      "difficulty": "MEDIUM",
                      "question": "What is the average time complexity of searching an element in a balanced BST?",
                      "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                      "correctAnswer": 1,
                      "explanation": "In a balanced binary search tree, the height is O(log n), so search takes logarithmic time."
                    }
                  ]
                }

                RAW TEXT CONTENT:
                %s
                """.formatted(title, category, companyName == null ? "None" : companyName,
                title, category, truncatedText);
    }

    private Map<String, Object> parseAndSanitize(String jsonStr, String rawFallback, String title, String category) {
        if (jsonStr == null || jsonStr.isBlank()) {
            return heuristicExtract(rawFallback, title, category, null);
        }
        String clean = jsonStr.trim();
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        clean = clean.trim();

        try {
            Map<String, Object> parsed = objectMapper.readValue(clean, new TypeReference<>() {});
            List<?> questions = (List<?>) parsed.get("questions");
            if (questions == null || questions.isEmpty()) {
                log.warn("LLM returned 0 questions, falling back to heuristic parser");
                return heuristicExtract(rawFallback, title, category, null);
            }
            return parsed;
        } catch (Exception e) {
            log.warn("Failed to parse LLM JSON: {}, fallback to heuristic", e.getMessage());
            return heuristicExtract(rawFallback, title, category, null);
        }
    }

    /**
     * Fallback heuristic parser that scans for questions, numbered options, and answer keys.
     */
    public Map<String, Object> heuristicExtract(String text, String title, String category, String companyName) {
        List<Map<String, Object>> questions = new ArrayList<>();
        if (text == null || text.isBlank()) {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("title", title);
            result.put("category", category);
            result.put("summary", "No text provided");
            result.put("questions", questions);
            return result;
        }

        // Split text by lines and look for patterns like "1.", "Q1.", "Question 1:"
        String[] lines = text.split("\\r?\\n");
        StringBuilder currentQuestion = new StringBuilder();
        List<String> currentOptions = new ArrayList<>();
        int correctAnswer = 0;
        StringBuilder currentExplanation = new StringBuilder();
        int questionIndex = 1;

        Pattern qPattern = Pattern.compile("^(?:Q(?:uestion)?\\s*\\d+[:.)]|\\d+[:.)])\\s*(.*)", Pattern.CASE_INSENSITIVE);
        Pattern optPattern = Pattern.compile("^[(\\s]*([A-Da-d])[)\\].:\\s]+(.*)");
        Pattern ansPattern = Pattern.compile("^(?:Ans(?:wer)?|Correct(?:\\s*Answer)?)\\s*[:=-]\\s*([A-Da-d0-3])", Pattern.CASE_INSENSITIVE);
        Pattern explPattern = Pattern.compile("^(?:Explanation|Solution|Sol)\\s*[:=-]\\s*(.*)", Pattern.CASE_INSENSITIVE);

        boolean inExplanation = false;

        for (String rawLine : lines) {
            String line = rawLine.trim();
            if (line.isBlank()) continue;

            Matcher qMatcher = qPattern.matcher(line);
            if (qMatcher.find()) {
                // Save previous question
                if (currentQuestion.length() > 0) {
                    questions.add(buildQuestionMap("q" + questionIndex++, currentQuestion.toString().trim(),
                            currentOptions, correctAnswer, currentExplanation.toString().trim(), category));
                    currentQuestion.setLength(0);
                    currentOptions.clear();
                    currentExplanation.setLength(0);
                    correctAnswer = 0;
                    inExplanation = false;
                }
                currentQuestion.append(qMatcher.group(1));
                continue;
            }

            Matcher ansMatcher = ansPattern.matcher(line);
            if (ansMatcher.find()) {
                String ansChar = ansMatcher.group(1).toUpperCase();
                correctAnswer = switch (ansChar) {
                    case "A", "0" -> 0;
                    case "B", "1" -> 1;
                    case "C", "2" -> 2;
                    case "D", "3" -> 3;
                    default -> 0;
                };
                continue;
            }

            Matcher explMatcher = explPattern.matcher(line);
            if (explMatcher.find()) {
                inExplanation = true;
                currentExplanation.append(explMatcher.group(1)).append(" ");
                continue;
            }

            Matcher optMatcher = optPattern.matcher(line);
            if (optMatcher.find()) {
                inExplanation = false;
                currentOptions.add(optMatcher.group(2).trim());
                continue;
            }

            if (inExplanation) {
                currentExplanation.append(line).append(" ");
            } else if (currentOptions.isEmpty() && currentQuestion.length() > 0) {
                currentQuestion.append(" ").append(line);
            }
        }

        // Add the last question
        if (currentQuestion.length() > 0) {
            questions.add(buildQuestionMap("q" + questionIndex, currentQuestion.toString().trim(),
                    currentOptions, correctAnswer, currentExplanation.toString().trim(), category));
        }

        // If no structured questions were found by regex, generate default sample questions from text chunks
        if (questions.isEmpty()) {
            String[] paragraphs = text.split("\\n\\s*\\n");
            int pIndex = 1;
            for (String p : paragraphs) {
                String cleanP = p.trim().replaceAll("\\s+", " ");
                if (cleanP.length() > 30) {
                    String qText = cleanP.length() > 180 ? cleanP.substring(0, 180) + "..." : cleanP;
                    List<String> mockOpts = List.of(
                            "Correct interpretation based on document",
                            "Alternative option with different parameters",
                            "Incorrect approach due to time limits",
                            "None of the above"
                    );
                    questions.add(buildQuestionMap("q" + pIndex++, qText, mockOpts, 0,
                            "Derived from: " + (cleanP.length() > 100 ? cleanP.substring(0, 100) + "..." : cleanP), category));
                    if (questions.size() >= 15) break; // Limit auto-chunking
                }
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("title", title);
        result.put("category", category);
        result.put("summary", "Extracted " + questions.size() + " questions from " + title);
        result.put("questions", questions);
        return result;
    }

    private Map<String, Object> buildQuestionMap(String id, String question, List<String> options,
                                                 int correctAnswer, String explanation, String category) {
        List<String> finalOptions = new ArrayList<>(options);
        if (finalOptions.size() < 2) {
            finalOptions = List.of("Option A (True/Standard)", "Option B (False/Alternative)", "Option C", "Option D");
        }
        while (finalOptions.size() < 4) {
            finalOptions.add("Option " + (char) ('A' + finalOptions.size()));
        }

        Map<String, Object> q = new LinkedHashMap<>();
        q.put("id", id);
        q.put("section", "COMPANY".equalsIgnoreCase(category) ? "Company Assessment" :
                "APTITUDE".equalsIgnoreCase(category) ? "Quantitative Aptitude" :
                "DSA".equalsIgnoreCase(category) ? "Data Structures & Algorithms" : "Core Computer Science");
        q.put("topic", category == null ? "General" : category);
        q.put("difficulty", "MEDIUM");
        q.put("question", question);
        q.put("options", finalOptions);
        q.put("correctAnswer", Math.min(correctAnswer, finalOptions.size() - 1));
        q.put("explanation", explanation.isBlank() ? "Standard placement problem solution and reasoning." : explanation);
        return q;
    }
}
