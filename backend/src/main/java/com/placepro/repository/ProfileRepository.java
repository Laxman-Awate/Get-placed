package com.placepro.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class ProfileRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public ProfileRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> get(UUID userId) {
        return jdbc.queryForObject("""
                select u.name,u.email,p.phone,p.location,p.college,p.degree,p.branch,
                       p.graduation_year as "graduationYear",p.semester,p.cgpa,
                       p.target_role as role,p.preferred_locations as locations,
                       p.target_companies::text as companies,p.skills::text as skills
                from users u left join student_profiles p on p.user_id=u.id
                where u.id=?
                """, (rs, rowNum) -> Map.ofEntries(
                Map.entry("name", value(rs.getString("name"))),
                Map.entry("email", value(rs.getString("email"))),
                Map.entry("phone", value(rs.getString("phone"))),
                Map.entry("location", value(rs.getString("location"))),
                Map.entry("college", value(rs.getString("college"))),
                Map.entry("degree", value(rs.getString("degree"))),
                Map.entry("branch", value(rs.getString("branch"))),
                Map.entry("graduationYear", value(rs.getString("graduationYear"))),
                Map.entry("semester", value(rs.getString("semester"))),
                Map.entry("cgpa", value(rs.getString("cgpa"))),
                Map.entry("role", value(rs.getString("role"))),
                Map.entry("locations", value(rs.getString("locations"))),
                Map.entry("companies", jsonList(rs.getString("companies"))),
                Map.entry("skills", jsonList(rs.getString("skills")))
        ), userId);
    }

    public Map<String, Object> update(UUID userId, Map<String, Object> profile) {
        jdbc.update("""
                update users set name=coalesce(?, name), updated_at=now() where id=?
                """, profile.get("name"), userId);
        jdbc.update("""
                insert into student_profiles (user_id, phone, location, college, degree, branch, graduation_year, semester, cgpa, target_role, preferred_locations, target_companies, skills)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?::jsonb)
                on conflict (user_id) do update set
                  phone=excluded.phone, location=excluded.location, college=excluded.college, degree=excluded.degree,
                  branch=excluded.branch, graduation_year=excluded.graduation_year, semester=excluded.semester,
                  cgpa=excluded.cgpa, target_role=excluded.target_role, preferred_locations=excluded.preferred_locations,
                  target_companies=excluded.target_companies, skills=excluded.skills, updated_at=now()
                """, userId, profile.get("phone"), profile.get("location"), profile.get("college"), profile.get("degree"),
                profile.get("branch"), profile.get("graduationYear"), profile.get("semester"), profile.get("cgpa"),
                profile.get("role"), profile.get("locations"), toJson(profile.get("companies")), toJson(profile.get("skills")));
        return get(userId);
    }

    private String value(String value) {
        return value == null ? "" : value;
    }

    private List<Object> jsonList(String json) {
        try {
            return objectMapper.readValue(json == null ? "[]" : json, new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value == null ? List.of() : value);
        } catch (Exception e) {
            return "[]";
        }
    }
}
