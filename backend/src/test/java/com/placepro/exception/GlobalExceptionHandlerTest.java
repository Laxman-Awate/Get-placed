package com.placepro.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pure unit tests — no Spring context, no database. Locks the error-body
 * contract the frontend relies on ({status, error, message, path}).
 */
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    private MockHttpServletRequest request(String uri) {
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRequestURI(uri);
        return req;
    }

    @Test
    void apiExceptionMapsToItsStatus() {
        ResponseEntity<Map<String, Object>> res =
                handler.handleApi(new ApiException(HttpStatus.NOT_FOUND, "Company not found."),
                        request("/api/companies/nope"));
        assertEquals(404, res.getStatusCode().value());
        assertEquals(404, res.getBody().get("status"));
        assertEquals("Company not found.", res.getBody().get("message"));
        assertEquals("/api/companies/nope", res.getBody().get("path"));
    }

    @Test
    void unexpectedExceptionBecomes500WithoutLeakingDetails() {
        ResponseEntity<Map<String, Object>> res =
                handler.handleUnexpected(new RuntimeException("db password=secret"),
                        request("/api/dashboard"));
        assertEquals(500, res.getStatusCode().value());
        assertEquals("Unexpected server error.", res.getBody().get("message"));
    }
}
