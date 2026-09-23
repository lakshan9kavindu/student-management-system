package com.example.backend.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    private final Map<String, AuthenticatedUser> tokens = new ConcurrentHashMap<>();

    public String createToken(String role, Long id) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, new AuthenticatedUser(role, id));
        return token;
    }

    public AuthenticatedUser findUser(String token) {
        return tokens.get(token);
    }
}
