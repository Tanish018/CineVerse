package com.tanish.moviebooking.auth.controller;

import com.tanish.moviebooking.auth.dto.AuthResponse;
import com.tanish.moviebooking.auth.dto.LoginRequest;
import com.tanish.moviebooking.auth.dto.RegisterRequest;
import com.tanish.moviebooking.auth.service.AuthService;
import com.tanish.moviebooking.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import com.tanish.moviebooking.exception.UnauthorizedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<String> register(@RequestBody RegisterRequest request) {

        String message = authService.register(request);
        return new ApiResponse<>(true,message,null);

    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);
        return new ApiResponse<>(true, "Login Success", response);

    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse> getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new UnauthorizedException("Unauthorized");
        }
        AuthResponse response = authService.getCurrentUser(principal.getName());
        return new ApiResponse<>(true, "User Details Retrieved", response);
    }

}