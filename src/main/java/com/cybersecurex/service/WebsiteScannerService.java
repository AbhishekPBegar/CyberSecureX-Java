package com.cybersecurex.service;

import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.*;
import java.util.*;

@Service
public class WebsiteScannerService {

    public Map<String, Object> scanWebsite(String url) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Clean and validate URL
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
            }

            URL website = new URL(url);
            String host = website.getHost();

            result.put("url", url);
            result.put("host", host);
            result.put("timestamp", new Date().toString());
            result.put("status", "success");

            // Check if website is reachable
            boolean reachable = isReachable(host);
            result.put("reachable", reachable);

            if (reachable) {
                // Port scanning
                List<Integer> openPorts = scanCommonPorts(host);
                result.put("openPorts", openPorts);

                // SSL/HTTPS check
                boolean hasSSL = url.startsWith("https://");
                result.put("hasSSL", hasSSL);

                // Get basic HTTP headers
                Map<String, String> headers = getBasicHeaders(url);
                result.put("headers", headers);

                // Security analysis
                List<String> securityIssues = analyzeSecurityHeaders(headers);
                result.put("securityIssues", securityIssues);

                result.put("message", "Scan completed successfully!");
            } else {
                result.put("message", "Website is not reachable");
            }

        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Error scanning website: " + e.getMessage());
        }

        return result;
    }

    private boolean isReachable(String host) {
        try {
            InetAddress address = InetAddress.getByName(host);
            return address.isReachable(5000); // 5 second timeout
        } catch (IOException e) {
            return false;
        }
    }

    private List<Integer> scanCommonPorts(String host) {
        List<Integer> openPorts = new ArrayList<>();
        int[] commonPorts = { 21, 22, 23, 25, 53, 80, 110, 443, 993, 995, 8080, 8443 };

        for (int port : commonPorts) {
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(host, port), 3000);
                openPorts.add(port);
            } catch (IOException ignored) {
                // Port is closed or filtered
            }
        }
        return openPorts;
    }

    private Map<String, String> getBasicHeaders(String url) {
        Map<String, String> headers = new HashMap<>();
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);
            connection.setRequestProperty("User-Agent", "CyberSecureX-Scanner/1.0");

            // Get response code
            int responseCode = connection.getResponseCode();
            headers.put("Response-Code", String.valueOf(responseCode));

            // Get important headers
            String server = connection.getHeaderField("Server");
            if (server != null)
                headers.put("Server", server);

            String contentType = connection.getHeaderField("Content-Type");
            if (contentType != null)
                headers.put("Content-Type", contentType);

        } catch (IOException e) {
            headers.put("Error", "Could not retrieve headers: " + e.getMessage());
        }
        return headers;
    }

    private List<String> analyzeSecurityHeaders(Map<String, String> headers) {
        List<String> issues = new ArrayList<>();

        // Check for security headers
        if (!headers.containsKey("X-Content-Type-Options")) {
            issues.add("Missing X-Content-Type-Options header (prevents MIME type sniffing)");
        }
        if (!headers.containsKey("X-Frame-Options")) {
            issues.add("Missing X-Frame-Options header (prevents clickjacking)");
        }
        if (!headers.containsKey("X-XSS-Protection")) {
            issues.add("Missing X-XSS-Protection header (XSS protection)");
        }
        if (!headers.containsKey("Strict-Transport-Security")) {
            issues.add("Missing HSTS header (HTTPS enforcement)");
        }

        if (issues.isEmpty()) {
            issues.add("Good! Basic security headers are present.");
        }

        return issues;
    }
}
