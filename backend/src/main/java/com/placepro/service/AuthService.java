package com.placepro.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.placepro.auth.AuthResponse;
import com.placepro.auth.AuthUserDto;
import com.placepro.auth.LoginRequest;
import com.placepro.auth.RegisterRequest;
import com.placepro.exception.ApiException;
import com.placepro.repository.UserRepository;
import com.placepro.security.GoogleAuthService;
import com.placepro.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleAuthService googleAuthService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, GoogleAuthService googleAuthService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.googleAuthService = googleAuthService;
    }

    public AuthResponse register(RegisterRequest request) {
        users.findByEmail(request.email()).ifPresent(user -> {
            throw new ApiException(HttpStatus.CONFLICT, "An account already exists for this email.");
        });
        return response(users.createLocal(request.name().trim(), request.email().trim(), passwordEncoder.encode(request.password())));
    }

    public AuthResponse login(LoginRequest request) {
        UserRepository.User user = users.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (user.passwordHash() == null || !passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return response(user);
    }

    public AuthResponse google(String idToken) {
        GoogleIdToken.Payload payload = googleAuthService.verifyToken(idToken);
        if (payload == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid or expired Google token.");
        }
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");
        return response(users.upsertGoogle(name != null ? name : email, email, picture));
    }

    private AuthResponse response(UserRepository.User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.name());
        claims.put("picture", user.pictureUrl());
        claims.put("role", user.role());
        claims.put("provider", user.provider());
        claims.put("plan", user.plan());
        String token = jwtTokenProvider.generateToken(user.email(), claims);
        AuthUserDto userDto = new AuthUserDto(user.id(), user.name(), user.email(), user.pictureUrl(), user.role(), user.provider(), user.plan());
        return AuthResponse.builder()
                .token(token)
                .email(user.email())
                .name(user.name())
                .pictureUrl(user.pictureUrl())
                .role(user.role())
                .provider(user.provider())
                .plan(user.plan())
                .user(userDto)
                .build();
    }
}
