package com.placepro.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record User(UUID id, String email, String passwordHash, String name, String pictureUrl, String provider, String role, String plan) {}

    private final RowMapper<User> mapper = (rs, rowNum) -> new User(
            rs.getObject("id", UUID.class),
            rs.getString("email"),
            rs.getString("password_hash"),
            rs.getString("name"),
            rs.getString("picture_url"),
            rs.getString("provider"),
            rs.getString("role"),
            rs.getString("plan")
    );

    public Optional<User> findByEmail(String email) {
        return jdbc.query("select * from users where lower(email)=lower(?)", mapper, email).stream().findFirst();
    }

    public Optional<User> findById(UUID id) {
        return jdbc.query("select * from users where id=?", mapper, id).stream().findFirst();
    }

    public User createLocal(String name, String email, String passwordHash) {
        User user = jdbc.queryForObject("""
                insert into users (name, email, password_hash, provider, role)
                values (?, lower(?), ?, 'LOCAL', 'STUDENT')
                returning *
                """, mapper, name, email, passwordHash);
        jdbc.update("insert into student_profiles (user_id) values (?)", user.id());
        return user;
    }

    public User upsertGoogle(String name, String email, String pictureUrl) {
        User user = jdbc.queryForObject("""
                insert into users (name, email, picture_url, provider, role)
                values (?, lower(?), ?, 'GOOGLE', 'STUDENT')
                on conflict (email) do update set
                  name = excluded.name,
                  picture_url = excluded.picture_url,
                  provider = case when users.provider = 'LOCAL' then users.provider else 'GOOGLE' end,
                  updated_at = now()
                returning *
                """, mapper, name, email, pictureUrl);
        jdbc.update("insert into student_profiles (user_id) values (?) on conflict (user_id) do nothing", user.id());
        return user;
    }
}
