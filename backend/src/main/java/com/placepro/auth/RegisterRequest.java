package com.placepro.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Name is required.") String name,
        @Email(message = "Enter a valid email address.") @NotBlank(message = "Email is required.") String email,
        @Size(min = 8, message = "Password must be at least 8 characters.") @NotBlank(message = "Password is required.") String password
) {}
