package com.placepro.service;

import com.placepro.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CurrentUserService {
    public UUID optionalUserId(HttpServletRequest request) {
        Object value = request.getAttribute("userId");
        return value instanceof UUID uuid ? uuid : null;
    }

    public UUID requiredUserId(HttpServletRequest request) {
        UUID userId = optionalUserId(request);
        if (userId == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "Authentication is required.");
        return userId;
    }
}
