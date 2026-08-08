package com.tanish.moviebooking.auth.service;

import com.tanish.moviebooking.auth.dto.RegisterRequest;
import com.tanish.moviebooking.common.Role;
import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.user.entity.User;
import com.tanish.moviebooking.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email Already Exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);
        return "User Saved Successfully";
    }

}
