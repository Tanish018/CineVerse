package com.tanish.moviebooking.screen.controller;

import com.tanish.moviebooking.common.ApiResponse;
import com.tanish.moviebooking.screen.dto.ScreenRequest;
import com.tanish.moviebooking.screen.dto.ScreenResponse;
import com.tanish.moviebooking.screen.service.ScreenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/screens")
@RequiredArgsConstructor
public class ScreenController {

    private final ScreenService screenService;

    @GetMapping("/theatre/{theatreId}")
    public ApiResponse<List<ScreenResponse>> getScreensByTheatre(@PathVariable("theatreId") Long theatreId) {
        List<ScreenResponse> response = screenService.getScreensByTheatre(theatreId);
        return new ApiResponse<>(true, "Successfully fetched Screens by Theatres", response);
    }

    @GetMapping("/{id}")
    public ApiResponse<ScreenResponse> getScreenById(@PathVariable("id") Long id) {
        ScreenResponse response = screenService.getScreenById(id);
        return new ApiResponse<>(true, "Successfully fetched Screen by id", response);
    }

    @PostMapping("/theatre/{theatreId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ScreenResponse> createScreen(@PathVariable("theatreId") Long theatreId, @Valid @RequestBody ScreenRequest request) {
        ScreenResponse response = screenService.createScreen(theatreId, request);
        return new ApiResponse<>(true, "Screen Created Successfully", response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ScreenResponse> updateScreen(@PathVariable("id") Long id, @Valid @RequestBody ScreenRequest screenRequest) {
        ScreenResponse response = screenService.updateScreen(id, screenRequest);
        return new ApiResponse<>(true, "Successfully Updated Screen by id", response);
    }

    // SHOULD NOT BE USED (SINCE, IT CAN CREATE INCONSISTENCY IN THE DATA) :-
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ScreenResponse> deactivateScreen(@PathVariable("id") Long id) {
        screenService.deactivateScreen(id);
        return new ApiResponse<>(true, "Successfully Deactivated Screen by id", null);
    }

}