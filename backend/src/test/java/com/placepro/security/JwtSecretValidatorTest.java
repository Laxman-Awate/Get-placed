package com.placepro.security;

import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pure unit tests — no Spring context, no database. Locks the fail-fast
 * behavior for a missing or weak JWT_SECRET (secrets audit).
 */
class JwtSecretValidatorTest {

    private static String randomSecret() {
        byte[] bytes = new byte[32];
        new java.security.SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    @Test
    void acceptsValidSecret() {
        assertDoesNotThrow(() -> new JwtSecretValidator(randomSecret()).run(null));
    }

    @Test
    void rejectsMissingSecret() {
        assertThrows(IllegalStateException.class, () -> new JwtSecretValidator("").run(null));
        assertThrows(IllegalStateException.class, () -> new JwtSecretValidator(null).run(null));
    }

    @Test
    void rejectsShortSecret() {
        String shortSecret = Base64.getEncoder().encodeToString(new byte[16]);
        assertThrows(IllegalStateException.class, () -> new JwtSecretValidator(shortSecret).run(null));
    }

    @Test
    void rejectsNonBase64Secret() {
        assertThrows(IllegalStateException.class,
                () -> new JwtSecretValidator("not-base64!!!").run(null));
    }
}
