package com.placepro.controller;

import com.placepro.repository.ProfileRepository;
import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileRepository profiles;
    private final CurrentUserService currentUser;

    public ProfileController(ProfileRepository profiles, CurrentUserService currentUser) {
        this.profiles = profiles;
        this.currentUser = currentUser;
    }

    @GetMapping
    public Object profile(HttpServletRequest request) {
        return profiles.get(currentUser.requiredUserId(request));
    }

    @PutMapping
    public Object update(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        return profiles.update(currentUser.requiredUserId(request), body);
    }
}
