package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.entity.Admin;
import com.example.backend.entity.Student;
import com.example.backend.repository.AdminRepository;
import com.example.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/student/login")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest request) {
        Optional<Student> studentOpt = studentRepository.findByEmail(request.getEmail());

        if (studentOpt.isPresent() && passwordEncoder.matches(request.getPassword(), studentOpt.get().getPassword())) {
            Student student = studentOpt.get();
            return ResponseEntity.ok(new AuthResponse(tokenService.createToken("STUDENT", student.getId()), "STUDENT", student.getId(), student));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());

        if (adminOpt.isPresent() && passwordEncoder.matches(request.getPassword(), adminOpt.get().getPassword())) {
            Admin admin = adminOpt.get();
            return ResponseEntity.ok(new AuthResponse(tokenService.createToken("ADMIN", admin.getId()), "ADMIN", admin.getId(), admin));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}