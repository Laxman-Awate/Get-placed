package com.placepro.controller;

import com.placepro.repository.ContentRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final ContentRepository content;
    private final CurrentUserService currentUser;

    public CompanyController(ContentRepository content, CurrentUserService currentUser) {
        this.content = content;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object companies(HttpServletRequest request) {
        return content.companies(currentUser.optionalUserId(request));
    }

    @GetMapping("/featured")
    public Object featured(HttpServletRequest request) {
        return content.companies(currentUser.optionalUserId(request)).stream().limit(6)
                .map(company -> java.util.Map.of("name", company.get("name"), "category", company.get("type"))).toList();
    }

    @GetMapping("/{id}")
    public Object company(@PathVariable String id, HttpServletRequest request) {
        return content.company(id, currentUser.optionalUserId(request))
                .orElseThrow(() -> new com.placepro.exception.ApiException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Company not found."));
    }

    @GetMapping("/{id}/preparation")
    public Object preparation(@PathVariable String id, HttpServletRequest request) {
        return content.companyPreparation(id, currentUser.optionalUserId(request));
    }

    @PatchMapping("/{id}/bookmark")
    public Object bookmark(@PathVariable String id, @RequestBody java.util.Map<String, Boolean> body, HttpServletRequest request) {
        return content.updateCompanyBookmark(currentUser.requiredUserId(request), id, Boolean.TRUE.equals(body.get("bookmarked")));
    }
}
