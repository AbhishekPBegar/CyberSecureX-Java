package com.cybersecurex.controller;

import com.cybersecurex.service.NetworkScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/network")
public class NetworkController {

    @Autowired
    private NetworkScannerService networkScannerService;

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanLocalNetwork() {
        Map<String, Object> result = networkScannerService.scanLocalNetwork();
        return ResponseEntity.ok(result);
    }
}
