package com.placepro.auth;

import java.util.UUID;

public record AuthUserDto(UUID id, String name, String email, String picture, String role, String provider, String plan) {}
