package com.placepro.controller;

import com.placepro.exception.ApiException;
import com.placepro.repository.ContentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/companies")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCompanyController {

    private final ContentRepository contentRepo;

    public AdminCompanyController(ContentRepository contentRepo) {
        this.contentRepo = contentRepo;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list() {
        return ResponseEntity.ok(contentRepo.allCompanies());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCompany(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        if (name == null || name.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Company name is required.");
        }

        String id = (String) payload.get("id");
        if (id == null || id.isBlank()) {
            id = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }

        String type = (String) payload.getOrDefault("type", "Product");
        String difficulty = (String) payload.getOrDefault("difficulty", "Medium");
        boolean premium = Boolean.TRUE.equals(payload.get("premium"));
        String description = (String) payload.getOrDefault("description", name + " recruitment process and interview questions.");
        List<String> areas = (List<String>) payload.getOrDefault("areas", List.of("DSA", "System Design", "Aptitude"));
        int modules = ((Number) payload.getOrDefault("modules", 4)).intValue();

        contentRepo.createCompany(id, name, type, difficulty, premium, description, areas, modules);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", id,
                "name", name,
                "type", type,
                "difficulty", difficulty,
                "premium", premium,
                "description", description,
                "areas", areas,
                "modules", modules
        ));
    }
}
