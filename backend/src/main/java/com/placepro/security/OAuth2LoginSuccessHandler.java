package com.placepro.security;

import com.placepro.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * Handles the final step of the Google authorization-code flow:
 * Google redirected to /login/oauth2/code/google, Spring exchanged the
 * code and authenticated the user. Here we upsert the Get-Placed user,
 * mint our own JWT and redirect back to the React OAuth callback page.
 */
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);

    private final AuthService authService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        try {
            OAuth2User principal = (OAuth2User) authentication.getPrincipal();
            String email = principal.getAttribute("email");
            String name = principal.getAttribute("name");
            String picture = principal.getAttribute("picture");
            if (principal instanceof OidcUser oidc) {
                if (email == null) email = oidc.getEmail();
                if (name == null) name = oidc.getFullName();
                if (picture == null) picture = oidc.getPicture();
            }

            var authResponse = authService.loginWithOAuth2(email, name, picture);

            String target = UriComponentsBuilder.fromUriString(frontendUrl)
                    .path("/oauth/callback")
                    .queryParam("token", authResponse.getToken())
                    .build().toUriString();
            response.sendRedirect(target);
        } catch (Exception e) {
            log.warn("OAuth2 login failed: {}", e.getMessage());
            response.sendRedirect(UriComponentsBuilder.fromUriString(frontendUrl)
                    .path("/login")
                    .queryParam("mode", "login")
                    .queryParam("error", "oauth_failed")
                    .build().toUriString());
        }
    }
}
