package com.cybersecurex.controller;

import com.cybersecurex.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzePassword(@RequestParam String password) {
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password cannot be empty"));
        }

        Map<String, Object> result = passwordService.analyzePassword(password.trim());
        return ResponseEntity.ok(result);
    }
}
