package com.tanish.moviebooking.auth.controller;

import com.tanish.moviebooking.auth.dto.RegisterRequest;
import com.tanish.moviebooking.auth.service.AuthService;
import com.tanish.moviebooking.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}