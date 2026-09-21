package com.placepro.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.placepro.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    private static final Logger log = LoggerFactory.getLogger(GoogleAuthService.class);

    @Value("${google.client.id:}")
    private String clientId;

    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        if (idTokenString == null || idTokenString.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Google ID token is required.");
        }
        if (clientId == null || clientId.isBlank()) {
            log.error("GOOGLE_CLIENT_ID is not configured (google.client.id is empty).");
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Google login is not configured on the server.");
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid or expired Google token.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            // Audience is already checked by the verifier, but double-check expiry + email verification.
            if (payload.getExpirationTimeSeconds() != null
                    && payload.getExpirationTimeSeconds() * 1000L < System.currentTimeMillis()) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Google token has expired. Please try again.");
            }
            Object emailVerified = payload.get("email_verified");
            if (!Boolean.TRUE.equals(emailVerified) && !payload.getEmailVerified()) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Google email is not verified.");
            }
            if (payload.getEmail() == null || payload.getEmail().isBlank()) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Google account has no email address.");
            }
            return payload;
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Failed to verify Google ID token: {}", e.getMessage());
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid or expired Google token.");
        }
    }
}
