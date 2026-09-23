package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@Entity
@Table(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private BigDecimal marks;

    // This annotation hides the internal Hibernate proxy data when converting to JSON
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public BigDecimal getMarks() { return marks; }
    public void setMarks(BigDecimal marks) { this.marks = marks; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}