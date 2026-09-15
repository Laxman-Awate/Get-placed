package com.placepro.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.placepro.dto.auth.AuthResponse;
import com.placepro.dto.auth.GoogleAuthRequest;
import com.placepro.security.GoogleAuthService;
import com.placepro.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final GoogleAuthService googleAuthService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogleUser(@Valid @RequestBody GoogleAuthRequest request) {
        GoogleIdToken.Payload payload = googleAuthService.verifyToken(request.getIdToken());

        if (payload == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired Google token."));
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");
        String role = "STUDENT";

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", name != null ? name : email);
        claims.put("picture", picture);
        claims.put("role", role);
        claims.put("provider", "GOOGLE");

        String token = jwtTokenProvider.generateToken(email, claims);

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .email(email)
                .name(name != null ? name : email)
                .pictureUrl(picture)
                .role(role)
                .build();

        return ResponseEntity.ok(response);
    }
}
