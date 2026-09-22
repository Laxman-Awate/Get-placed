package com.placepro.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Repository
public class GeneratedContentRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public GeneratedContentRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    public UUID create(UUID resourceId, String contentType, String title, String dataJson) {
        UUID id = UUID.randomUUID();
        jdbc.update("""
                insert into generated_content (id, resource_id, content_type, title, data, status)
                values (?, ?, ?, ?, ?::jsonb, 'DRAFT')
                """, id, resourceId, contentType, title, dataJson == null ? "{}" : dataJson);
        return id;
    }

    public Optional<Map<String, Object>> findById(UUID id) {
        List<Map<String, Object>> list = jdbc.query("""
                select gc.*, gc.data::text as data_text, ar.title as resource_title, ar.company_id,
                       ar.category as resource_category, c.name as company_name
                from generated_content gc
                join admin_resources ar on ar.id = gc.resource_id
                left join companies c on c.id = ar.company_id
                where gc.id = ?
                """, (rs, rowNum) -> mapContent(rs), id);
        return list.stream().findFirst();
    }

    public List<Map<String, Object>> findByResourceId(UUID resourceId) {
        return jdbc.query("""
                select gc.*, gc.data::text as data_text, ar.title as resource_title, ar.company_id,
                       ar.category as resource_category, c.name as company_name
                from generated_content gc
                join admin_resources ar on ar.id = gc.resource_id
                left join companies c on c.id = ar.company_id
                where gc.resource_id = ?
                order by gc.created_at asc
                """, (rs, rowNum) -> mapContent(rs), resourceId);
    }

    public void updateDraft(UUID id, String title, String dataJson) {
        jdbc.update("""
                update generated_content
                set title = coalesce(?, title), data = ?::jsonb, updated_at = now()
                where id = ?
                """, title, dataJson, id);
    }

    public void updateStatus(UUID id, String status, String targetEntityId) {
        jdbc.update("""
                update generated_content
                set status = ?, target_entity_id = ?, updated_at = now()
                where id = ?
                """, status, targetEntityId, id);
    }

    public boolean delete(UUID id) {
        return jdbc.update("delete from generated_content where id = ?", id) > 0;
    }

    private Map<String, Object> mapContent(ResultSet rs) throws SQLException {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", rs.getObject("id", UUID.class));
        m.put("resourceId", rs.getObject("resource_id", UUID.class));
        m.put("resourceTitle", rs.getString("resource_title"));
        m.put("resourceCategory", rs.getString("resource_category"));
        m.put("companyId", rs.getString("company_id"));
        m.put("companyName", rs.getString("company_name"));
        m.put("contentType", rs.getString("content_type"));
        m.put("title", rs.getString("title"));
        m.put("targetEntityId", rs.getString("target_entity_id"));
        m.put("status", rs.getString("status"));
        m.put("createdAt", rs.getTimestamp("created_at"));
        m.put("updatedAt", rs.getTimestamp("updated_at"));

        String rawData = rs.getString("data_text");
        if (rawData != null) {
            try {
                m.put("data", objectMapper.readValue(rawData, new TypeReference<Map<String, Object>>() {}));
            } catch (Exception e) {
                m.put("data", rawData);
            }
        } else {
            m.put("data", Map.of());
        }
        return m;
    }
}
