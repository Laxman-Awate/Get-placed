package com.placepro.controller;

import com.placepro.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {
    private final JdbcTemplate jdbc;
    private final CurrentUserService currentUser;

    public ActivityController(JdbcTemplate jdbc, CurrentUserService currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
    }

    @GetMapping("/calendar")
    public Map<String, Integer> calendar(HttpServletRequest request) {
        UUID userId = currentUser.optionalUserId(request);
        if (userId == null) return Map.of();
        return jdbc.queryForList("""
                select activity_date::text as day, count(*)::int as count from (
                  select updated_at::date as activity_date from user_dsa_progress where user_id=?
                  union all select updated_at::date from user_coding_progress where user_id=?
                  union all select attempted_at::date from user_aptitude_progress where user_id=?
                  union all select completed_at::date from mock_test_attempts where user_id=?
                  union all select activity_date from activity_events where user_id=?
                ) x
                where activity_date >= current_date - interval '1 year'
                group by activity_date
                """, userId, userId, userId, userId, userId).stream()
                .collect(Collectors.toMap(row -> (String) row.get("day"), row -> (Integer) row.get("count")));
    }
}
