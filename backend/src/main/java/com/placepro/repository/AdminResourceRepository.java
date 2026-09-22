package com.placepro.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Repository
public class AdminResourceRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public AdminResourceRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    public UUID create(UUID uploadedBy, String title, String resourceType, String category,
                       String companyId, String filePath, String fileName, Long fileSize, String rawText) {
        UUID id = UUID.randomUUID();
        jdbc.update("""
                insert into admin_resources (id, uploaded_by, title, resource_type, category, company_id,
                                             file_path, file_name, file_size, raw_text, status)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UPLOADED')
                """, id, uploadedBy, title, resourceType, category, companyId, filePath, fileName, fileSize, rawText);
        return id;
    }

    public Optional<Map<String, Object>> findById(UUID id) {
        List<Map<String, Object>> list = jdbc.query("""
                select r.*, r.parsed_json::text as parsed_json_text, c.name as company_name, u.name as uploaded_by_name
                from admin_resources r
                left join companies c on c.id = r.company_id
                left join users u on u.id = r.uploaded_by
                where r.id = ?
                """, (rs, rowNum) -> mapResource(rs), id);
        return list.stream().findFirst();
    }

    public List<Map<String, Object>> findAll(String category, String status, int limit, int offset) {
        StringBuilder sql = new StringBuilder("""
                select r.*, r.parsed_json::text as parsed_json_text, c.name as company_name, u.name as uploaded_by_name,
                       (select count(*) from generated_content gc where gc.resource_id = r.id) as generated_count
                from admin_resources r
                left join companies c on c.id = r.company_id
                left join users u on u.id = r.uploaded_by
                where 1=1
                """);
        List<Object> params = new ArrayList<>();
        if (category != null && !category.isBlank()) {
            sql.append(" and r.category = ?");
            params.add(category);
        }
        if (status != null && !status.isBlank()) {
            sql.append(" and r.status = ?");
            params.add(status);
        }
        sql.append(" order by r.created_at desc limit ? offset ?");
        params.add(limit <= 0 ? 50 : limit);
        params.add(Math.max(0, offset));

        return jdbc.query(sql.toString(), (rs, rowNum) -> {
            Map<String, Object> map = mapResource(rs);
            map.put("generatedCount", rs.getInt("generated_count"));
            return map;
        }, params.toArray());
    }

    public void updateStatus(UUID id, String status, String errorMessage) {
        jdbc.update("""
                update admin_resources
                set status = ?, error_message = ?, updated_at = now()
                where id = ?
                """, status, errorMessage, id);
    }

    public void updateParsedJson(UUID id, String parsedJson, String status) {
        jdbc.update("""
                update admin_resources
                set parsed_json = ?::jsonb, status = ?, error_message = null, updated_at = now()
                where id = ?
                """, parsedJson, status, id);
    }

    public void updateRawText(UUID id, String rawText) {
        jdbc.update("update admin_resources set raw_text = ?, updated_at = now() where id = ?", rawText, id);
    }

    public boolean delete(UUID id) {
        return jdbc.update("delete from admin_resources where id = ?", id) > 0;
    }

    public Map<String, Object> getDashboardStats() {
        return jdbc.query("""
                select
                    count(*) as total_resources,
                    count(*) filter (where status in ('UPLOADED', 'PARSING', 'GENERATING')) as in_progress,
                    count(*) filter (where status = 'REVIEW') as pending_review,
                    count(*) filter (where status = 'PUBLISHED') as published,
                    count(*) filter (where status = 'FAILED') as failed,
                    (select count(*) from generated_content where status = 'PUBLISHED') as published_content_count
                from admin_resources
                """, rs -> {
            Map<String, Object> stats = new HashMap<>();
            if (rs.next()) {
                stats.put("totalResources", rs.getLong("total_resources"));
                stats.put("inProgress", rs.getLong("in_progress"));
                stats.put("pendingReview", rs.getLong("pending_review"));
                stats.put("published", rs.getLong("published"));
                stats.put("failed", rs.getLong("failed"));
                stats.put("publishedContentCount", rs.getLong("published_content_count"));
            } else {
                stats.put("totalResources", 0L);
                stats.put("inProgress", 0L);
                stats.put("pendingReview", 0L);
                stats.put("published", 0L);
                stats.put("failed", 0L);
                stats.put("publishedContentCount", 0L);
            }
            return stats;
        });
    }

    private Map<String, Object> mapResource(ResultSet rs) throws SQLException {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", rs.getObject("id", UUID.class));
        m.put("uploadedBy", rs.getObject("uploaded_by", UUID.class));
        m.put("uploadedByName", rs.getString("uploaded_by_name"));
        m.put("title", rs.getString("title"));
        m.put("resourceType", rs.getString("resource_type"));
        m.put("category", rs.getString("category"));
        m.put("companyId", rs.getString("company_id"));
        m.put("companyName", rs.getString("company_name"));
        m.put("filePath", rs.getString("file_path"));
        m.put("fileName", rs.getString("file_name"));
        m.put("fileSize", rs.getObject("file_size"));
        m.put("status", rs.getString("status"));
        m.put("errorMessage", rs.getString("error_message"));
        m.put("createdAt", rs.getTimestamp("created_at"));
        m.put("updatedAt", rs.getTimestamp("updated_at"));

        String rawParsed = rs.getString("parsed_json_text");
        if (rawParsed != null) {
            try {
                m.put("parsedJson", objectMapper.readValue(rawParsed, new TypeReference<Map<String, Object>>() {}));
            } catch (Exception ignored) {
                try {
                    m.put("parsedJson", objectMapper.readValue(rawParsed, new TypeReference<List<Object>>() {}));
                } catch (Exception e) {
                    m.put("parsedJson", rawParsed);
                }
            }
        } else {
            m.put("parsedJson", null);
        }
        return m;
    }
}
