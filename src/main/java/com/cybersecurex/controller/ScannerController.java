package com.cybersecurex.controller;

import com.cybersecurex.service.WebsiteScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/scanner")
public class ScannerController {

    @Autowired
    private WebsiteScannerService scannerService;

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanWebsite(@RequestParam String url) {
        Map<String, Object> result = scannerService.scanWebsite(url);
        return ResponseEntity.ok(result);
    }
}
