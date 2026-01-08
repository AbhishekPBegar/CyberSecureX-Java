package com.cybersecurex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "CyberSecureX Java Edition");
        model.addAttribute("message", "Welcome to your Security Toolkit!");
        return "index";
    }

    @GetMapping("/scanner")
    public String scanner(Model model) {
        model.addAttribute("title", "Website Scanner - CyberSecureX");
        return "scanner";
    }

    @GetMapping("/network")
    public String network(Model model) {
        model.addAttribute("title", "Network Scanner - CyberSecureX");
        return "network";
    }

    @GetMapping("/password")
    public String password(Model model) {
        model.addAttribute("title", "Password Security Checker - CyberSecureX");
        return "password";
    }

    @GetMapping("/file-share")
    public String fileShare(Model model) {
        model.addAttribute("title", "Secure File Sharing - CyberSecureX");
        return "file-share";
    }

}
