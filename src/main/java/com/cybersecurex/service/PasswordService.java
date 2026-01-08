package com.cybersecurex.service;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class PasswordService {

    private static final String HIBP_API_URL = "https://api.pwnedpasswords.com/range/";

    public Map<String, Object> analyzePassword(String password) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Calculate strength score
            int score = calculateStrengthScore(password);
            String strength = getStrengthLabel(score);

            // Get improvement suggestions
            List<String> suggestions = getImprovementSuggestions(password);

            // Check if password has been breached (this might take a moment)
            Map<String, Object> breachInfo = checkPasswordBreach(password);

            // Detailed analysis
            Map<String, Object> analysis = getDetailedAnalysis(password);

            result.put("password", "•".repeat(password.length())); // Hide actual password
            result.put("score", score);
            result.put("strength", strength);
            result.put("suggestions", suggestions);
            result.put("breachInfo", breachInfo);
            result.put("analysis", analysis);
            result.put("timestamp", new Date().toString());
            result.put("status", "success");

        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Error analyzing password: " + e.getMessage());
        }

        return result;
    }

    private int calculateStrengthScore(String password) {
        int score = 0;

        // Length scoring (up to 40 points)
        score += Math.min(password.length() * 4, 40);

        // Character variety (50 points total)
        if (Pattern.compile("[a-z]").matcher(password).find())
            score += 10;
        if (Pattern.compile("[A-Z]").matcher(password).find())
            score += 10;
        if (Pattern.compile("[0-9]").matcher(password).find())
            score += 10;
        if (Pattern.compile("[^a-zA-Z0-9]").matcher(password).find())
            score += 15;

        // Length bonuses
        if (password.length() >= 8)
            score += 5;
        if (password.length() >= 12)
            score += 10;
        if (password.length() >= 16)
            score += 5;

        // Complexity bonuses
        if (hasNoRepeatingChars(password))
            score += 5;
        if (hasNoCommonPatterns(password))
            score += 5;
        if (hasGoodMixOfChars(password))
            score += 5;

        return Math.min(score, 100);
    }

    private String getStrengthLabel(int score) {
        if (score >= 90)
            return "Excellent";
        if (score >= 75)
            return "Strong";
        if (score >= 60)
            return "Good";
        if (score >= 40)
            return "Fair";
        if (score >= 25)
            return "Weak";
        return "Very Weak";
    }

    private List<String> getImprovementSuggestions(String password) {
        List<String> suggestions = new ArrayList<>();

        if (password.length() < 8) {
            suggestions.add("🔢 Use at least 8 characters (current: " + password.length() + ")");
        }
        if (password.length() < 12) {
            suggestions.add("🎯 Consider 12+ characters for better security");
        }
        if (!Pattern.compile("[a-z]").matcher(password).find()) {
            suggestions.add("🔤 Add lowercase letters (a-z)");
        }
        if (!Pattern.compile("[A-Z]").matcher(password).find()) {
            suggestions.add("🔠 Add uppercase letters (A-Z)");
        }
        if (!Pattern.compile("[0-9]").matcher(password).find()) {
            suggestions.add("🔢 Add numbers (0-9)");
        }
        if (!Pattern.compile("[^a-zA-Z0-9]").matcher(password).find()) {
            suggestions.add("🔣 Add special characters (!@#$%^&*)");
        }
        if (hasRepeatingChars(password)) {
            suggestions.add("🔄 Avoid repeating characters (aaa, 111)");
        }
        if (hasCommonPatterns(password)) {
            suggestions.add("🚫 Avoid common patterns (123, abc, qwe)");
        }
        if (isCommonPassword(password)) {
            suggestions.add("⚠️ Avoid common passwords");
        }

        if (suggestions.isEmpty()) {
            suggestions.add("✅ Your password looks strong! Keep it secure.");
        }

        return suggestions;
    }

    private Map<String, Object> checkPasswordBreach(String password) {
        Map<String, Object> breachInfo = new HashMap<>();

        try {
            // Hash the password using SHA-1
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] hash = md.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            String sha1Hash = hexString.toString().toUpperCase();

            // Get first 5 characters for k-anonymity
            String prefix = sha1Hash.substring(0, 5);
            String suffix = sha1Hash.substring(5);

            // Call HaveIBeenPwned API
            URL url = new URL(HIBP_API_URL + prefix);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "CyberSecureX-PasswordChecker/1.0");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    String[] parts = line.split(":");
                    if (parts.length == 2 && parts[0].equals(suffix)) {
                        int count = Integer.parseInt(parts[1]);
                        breachInfo.put("breached", true);
                        breachInfo.put("count", count);
                        breachInfo.put("message", "⚠️ This password has been found in " + count + " data breaches!");
                        reader.close();
                        return breachInfo;
                    }
                }
                reader.close();
            }

            breachInfo.put("breached", false);
            breachInfo.put("message", "✅ Password not found in known data breaches");

        } catch (Exception e) {
            breachInfo.put("breached", false);
            breachInfo.put("message", "⚠️ Could not check breach database: " + e.getMessage());
            breachInfo.put("error", true);
        }

        return breachInfo;
    }

    private Map<String, Object> getDetailedAnalysis(String password) {
        Map<String, Object> analysis = new HashMap<>();

        analysis.put("length", password.length());
        analysis.put("hasLowercase", Pattern.compile("[a-z]").matcher(password).find());
        analysis.put("hasUppercase", Pattern.compile("[A-Z]").matcher(password).find());
        analysis.put("hasNumbers", Pattern.compile("[0-9]").matcher(password).find());
        analysis.put("hasSpecialChars", Pattern.compile("[^a-zA-Z0-9]").matcher(password).find());
        analysis.put("uniqueChars", password.chars().distinct().count());
        analysis.put("entropy", calculateEntropy(password));

        return analysis;
    }

    private boolean hasNoRepeatingChars(String password) {
        return !hasRepeatingChars(password);
    }

    private boolean hasRepeatingChars(String password) {
        for (int i = 0; i < password.length() - 2; i++) {
            if (password.charAt(i) == password.charAt(i + 1) &&
                    password.charAt(i) == password.charAt(i + 2)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasNoCommonPatterns(String password) {
        return !hasCommonPatterns(password);
    }

    private boolean hasCommonPatterns(String password) {
        String lower = password.toLowerCase();
        String[] patterns = { "123", "abc", "qwe", "password", "admin", "login", "welcome" };
        for (String pattern : patterns) {
            if (lower.contains(pattern)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasGoodMixOfChars(String password) {
        int categories = 0;
        if (Pattern.compile("[a-z]").matcher(password).find())
            categories++;
        if (Pattern.compile("[A-Z]").matcher(password).find())
            categories++;
        if (Pattern.compile("[0-9]").matcher(password).find())
            categories++;
        if (Pattern.compile("[^a-zA-Z0-9]").matcher(password).find())
            categories++;
        return categories >= 3;
    }

    private boolean isCommonPassword(String password) {
        String[] common = { "password", "123456", "password123", "admin", "qwerty",
                "letmein", "welcome", "monkey", "dragon" };
        String lower = password.toLowerCase();
        for (String commonPwd : common) {
            if (lower.equals(commonPwd)) {
                return true;
            }
        }
        return false;
    }

    private double calculateEntropy(String password) {
        Map<Character, Integer> frequencies = new HashMap<>();
        for (char c : password.toCharArray()) {
            frequencies.put(c, frequencies.getOrDefault(c, 0) + 1);
        }

        double entropy = 0.0;
        int length = password.length();
        for (int freq : frequencies.values()) {
            double probability = (double) freq / length;
            entropy -= probability * (Math.log(probability) / Math.log(2));
        }

        return Math.round(entropy * 100.0) / 100.0;
    }
}
