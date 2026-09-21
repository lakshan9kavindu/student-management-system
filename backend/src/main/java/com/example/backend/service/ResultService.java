package com.example.backend.service;

import com.example.backend.entity.Result;
import com.example.backend.entity.Student;
import com.example.backend.repository.ResultRepository;
import com.example.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Result addResult(Long studentId, Result result) {
        // Find the student first, then attach them to the result
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id " + studentId));

        result.setStudent(student);
        return resultRepository.save(result);
    }

    public List<Result> getResultsByStudentId(Long studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    public void deleteResult(Long id) {
        resultRepository.deleteById(id);
    }
}