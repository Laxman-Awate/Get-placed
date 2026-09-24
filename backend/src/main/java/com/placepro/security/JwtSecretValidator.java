package com.placepro.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Fails fast at startup when no usable JWT secret is configured, instead of
 * serving traffic that can never issue or verify tokens.
 */
@Component
public class JwtSecretValidator implements ApplicationRunner {

    private final String jwtSecret;

    public JwtSecretValidator(@Value("${jwt.secret:}") String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException(
                    "Missing JWT_SECRET environment variable. Set it to a Base64-encoded 256-bit key. "
                            + "Generate with: openssl rand -base64 32");
        }
        try {
            byte[] keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(jwtSecret);
            if (keyBytes.length < 32) {
                throw new IllegalStateException(
                        "Invalid JWT_SECRET: decoded key is only " + keyBytes.length
                                + " bytes, at least 32 bytes (256 bits) are required.");
            }
        } catch (RuntimeException e) {
            throw new IllegalStateException(
                    "Invalid JWT_SECRET: must be Base64-encoded. Generate with: openssl rand -base64 32", e);
        }
    }
}
