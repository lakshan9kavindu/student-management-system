package com.example.backend.controller;

import com.example.backend.entity.Student;
import com.example.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*") // Allows React frontend to communicate with this API
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.createStudent(student));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id, Authentication authentication) {
        if (!isOwner(id, authentication)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails,
                                                 Authentication authentication) {
        if (!isOwner(id, authentication)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        try {
            return ResponseEntity.ok(studentService.updateStudent(id, studentDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id, Authentication authentication) {
        if (!isOwner(id, authentication)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isOwner(Long studentId, Authentication authentication) {
        if (authentication == null) return false;
        var user = (com.example.backend.security.AuthenticatedUser) authentication.getPrincipal();
        return user.role().equals("ADMIN") || (user.role().equals("STUDENT") && user.id().equals(studentId));
    }
}