package com.tanish.moviebooking.movie.controller;

import com.tanish.moviebooking.common.ApiResponse;
import com.tanish.moviebooking.movie.dto.MovieRequest;
import com.tanish.moviebooking.movie.dto.MovieResponse;
import com.tanish.moviebooking.movie.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieResponse> createMovie(@Valid @RequestBody MovieRequest request) {
        MovieResponse response = movieService.createMovie(request);
        return new ApiResponse<>(true,"Movie Created Successfully", response);
    }

    @GetMapping
    public ApiResponse<List<MovieResponse>> getAllMovies() {
        List<MovieResponse> response = movieService.getAllMovies();
        return new ApiResponse<>(true,"Movies Fetched Successfully", response);
    }

    @GetMapping("/{id}")
    public ApiResponse<MovieResponse> getMovieById(@PathVariable Long id) {
        MovieResponse response = movieService.getMovieById(id);
        return new ApiResponse<>(true,"Movie Found Successfully", response);
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieResponse> updateMovie(@Valid @RequestBody MovieRequest request, @PathVariable Long id) {
        MovieResponse response = movieService.updateMovie(id, request);
        return new ApiResponse<>(true,"Movie Updated Successfully", response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieResponse> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return new ApiResponse<>(true,"Movie Deleted Successfully", null);
    }

}