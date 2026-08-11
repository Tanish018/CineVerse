package com.tanish.moviebooking.theatre.controller;

import com.tanish.moviebooking.common.ApiResponse;
import com.tanish.moviebooking.theatre.dto.TheatreRequest;
import com.tanish.moviebooking.theatre.dto.TheatreResponse;
import com.tanish.moviebooking.theatre.service.TheatreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/theatres")
@RequiredArgsConstructor
public class TheatreController {

    public final TheatreService theatreService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TheatreResponse> createTheatre(@Valid @RequestBody TheatreRequest request) {
        TheatreResponse response = theatreService.createTheatre(request);
        return new ApiResponse<>(true, "Theatre created successfully", response);
    }

    @GetMapping
    public ApiResponse<List<TheatreResponse>> getAllTheatres(@RequestParam(required = false) String city) {
        List<TheatreResponse> response;
        if (city != null && !city.isBlank()) {
            response = theatreService.getTheatresByCity(city);
        } else {
            response = theatreService.getAllTheatres();
        }
        return new ApiResponse<>(true, "All Theatres retrieved successfully", response);
    }

    @GetMapping("/{id}")
    public ApiResponse<TheatreResponse> getTheatreById(@PathVariable Long id) {
        TheatreResponse response = theatreService.getTheatreById(id);
        return new ApiResponse<>(true, "Theatre retrieved successfully", response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TheatreResponse> updateTheatre(@PathVariable Long id, @Valid @RequestBody TheatreRequest request) {
        TheatreResponse response = theatreService.updateTheatre(id, request);
        return new ApiResponse<>(true, "Theatre updated successfully", response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TheatreResponse> deleteTheatre(@PathVariable Long id) {
        theatreService.deleteTheatre(id);
        return new ApiResponse<>(true, "Theatre Deleted Successfully", null);
    }

}
