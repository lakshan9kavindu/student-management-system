package com.example.backend.dto;

public class AuthResponse {
    private final String token;
    private final String role;
    private final Long userId;
    private final Object user;

    public AuthResponse(String token, String role, Long userId, Object user) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.user = user;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public Long getUserId() { return userId; }
    public Object getUser() { return user; }
}
