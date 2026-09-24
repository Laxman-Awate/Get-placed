package com.placepro.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pure unit tests — no Spring context, no database. Covers the auth fix
 * surface: tokens must round-trip and tampered/foreign tokens must fail.
 */
class JwtTokenProviderTest {

    private JwtTokenProvider provider;

    private static String randomSecret() {
        byte[] bytes = new byte[32];
        new java.security.SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    @BeforeEach
    void setUp() {
        provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "jwtSecret", randomSecret());
        ReflectionTestUtils.setField(provider, "jwtExpirationInMs", 3_600_000L);
    }

    @Test
    void generateValidateRoundTrip() {
        String token = provider.generateToken("student@example.com", Map.of("role", "STUDENT"));
        assertTrue(provider.validateToken(token));
        assertEquals("student@example.com", provider.getEmailFromToken(token));
    }

    @Test
    void tamperedTokenFailsValidation() {
        String token = provider.generateToken("student@example.com", Map.of());
        String tampered = token.substring(0, token.length() - 2) + "ab";
        assertFalse(provider.validateToken(tampered));
    }

    @Test
    void garbageTokenFailsValidation() {
        assertFalse(provider.validateToken("not-a-jwt"));
        assertFalse(provider.validateToken(""));
        assertFalse(provider.validateToken(null));
    }

    @Test
    void tokenFromAnotherSecretFailsValidation() {
        JwtTokenProvider other = new JwtTokenProvider();
        ReflectionTestUtils.setField(other, "jwtSecret", randomSecret());
        ReflectionTestUtils.setField(other, "jwtExpirationInMs", 3_600_000L);
        String foreign = other.generateToken("student@example.com", Map.of());
        assertFalse(provider.validateToken(foreign));
    }
}
