package com.tanish.moviebooking.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "API is working";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminOnly() {
        return "Admin API working";
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public String userOnly() {
        return "User API working";
    }

    @GetMapping("/mixed")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public String mixed() {
        return "API working";
    }

}