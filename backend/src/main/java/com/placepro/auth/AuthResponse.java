package com.placepro.auth;

public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String pictureUrl;
    private String role;
    private String provider;
    private String plan;
    private AuthUserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String name, String pictureUrl, String role, String provider, String plan, AuthUserDto user) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.pictureUrl = pictureUrl;
        this.role = role;
        this.provider = provider;
        this.plan = plan;
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String email;
        private String name;
        private String pictureUrl;
        private String role;
        private String provider;
        private String plan;
        private AuthUserDto user;

        public Builder token(String token) { this.token = token; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder pictureUrl(String pictureUrl) { this.pictureUrl = pictureUrl; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder provider(String provider) { this.provider = provider; return this; }
        public Builder plan(String plan) { this.plan = plan; return this; }
        public Builder user(AuthUserDto user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, email, name, pictureUrl, role, provider, plan, user);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPictureUrl() { return pictureUrl; }
    public void setPictureUrl(String pictureUrl) { this.pictureUrl = pictureUrl; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public AuthUserDto getUser() { return user; }
    public void setUser(AuthUserDto user) { this.user = user; }
}
