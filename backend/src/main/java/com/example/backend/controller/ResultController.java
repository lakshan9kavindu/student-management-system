package com.example.backend.controller;

import com.example.backend.entity.Result;
import com.example.backend.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Result> addResult(@PathVariable Long studentId, @RequestBody Result result) {
        try {
            return ResponseEntity.ok(resultService.addResult(studentId, result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<Result>> getStudentResults(@PathVariable Long studentId, Authentication authentication) {
        var user = (com.example.backend.security.AuthenticatedUser) authentication.getPrincipal();
        if (user.role().equals("STUDENT") && !user.id().equals(studentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // Student ownership is enforced by the security service below.
        return ResponseEntity.ok(resultService.getResultsByStudentId(studentId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Result> updateResult(@PathVariable Long id, @RequestBody Result result) {
        try {
            return ResponseEntity.ok(resultService.updateResult(id, result));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}