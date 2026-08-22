package com.tanish.moviebooking.show.controller;

import com.tanish.moviebooking.common.ApiResponse;
import com.tanish.moviebooking.seat.dto.SeatResponse;
import com.tanish.moviebooking.seat.entity.Seat;
import com.tanish.moviebooking.show.dto.ShowRequest;
import com.tanish.moviebooking.show.dto.ShowResponse;
import com.tanish.moviebooking.show.dto.ShowSearchRequest;
import com.tanish.moviebooking.show.dto.ShowSeatResponse;
import com.tanish.moviebooking.show.service.ShowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ShowResponse> createShow(@Valid @RequestBody ShowRequest showRequest) {
        ShowResponse res =  showService.createShow(showRequest);
        return new ApiResponse<>(true, "Show created successfully", res);
    }

    @PutMapping("/{showId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ShowResponse> updateShow(@Valid @RequestBody ShowRequest showRequest, @PathVariable Long showId) {
        ShowResponse res =  showService.updateShow(showId, showRequest);
        return new ApiResponse<>(true, "Show updated successfully", res);
    }

    @GetMapping("/{showId}")
    public ApiResponse<ShowResponse> getShowById(@PathVariable("showId") Long showId) {
        ShowResponse res =  showService.getShowById(showId);
        return new ApiResponse<>(true, "Show retrieved successfully", res);
    }

    @GetMapping("screen/{screenId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<ShowResponse>> getShowByScreenId(@PathVariable("screenId") Long screenId) {
        List<ShowResponse> res = showService.getShowsByScreen(screenId);
        return new ApiResponse<>(true, "Show retrieved successfully", res);
    }

    @GetMapping("screen/{screenId}/date/{showDate}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<ShowResponse>> getShowByScreenIdAndDate(@PathVariable Long screenId, @PathVariable LocalDate showDate) {
        List<ShowResponse> res = showService.getShowsByScreenAndDate(screenId, showDate);
        return new ApiResponse<>(true, "Show retrieved successfully", res);
    }

    @GetMapping("movie/{movieId}")
    public ApiResponse<List<ShowResponse>> getShowByMovieId(@PathVariable("movieId") Long movieId) {
        List<ShowResponse> res = showService.getShowsByMovie(movieId);
        return new ApiResponse<>(true, "Show retrieved successfully", res);
    }

    @GetMapping("movie/{movieId}/date/{showDate}")
    public ApiResponse<List<ShowResponse>> getShowsByMovieAndDate(@PathVariable Long movieId, @PathVariable LocalDate showDate) {
        List<ShowResponse> res = showService.getShowsByMovieAndDate(movieId, showDate);
        return new ApiResponse<>(true, "Show retrieved successfully", res);
    }

    @DeleteMapping("/{showId}")
    public ApiResponse<Void> deleteShow(@PathVariable("showId") Long showId) {
        showService.DeleteShow(showId);
        return new ApiResponse<>(true, "Show Deleted Successfully", null);
    }

    @GetMapping("/search")
    public ApiResponse<List<ShowResponse>> searchShows(@ModelAttribute ShowSearchRequest request) {
        List<ShowResponse> res = showService.searchShows(request);
        return new ApiResponse<>(true, "Shows retrieved successfully", res);
    }

    @GetMapping("/{showId}/seats")
    public ApiResponse<List<ShowSeatResponse>> getSeatsByShow(@PathVariable Long showId) {
        List<ShowSeatResponse> res = showService.getSeatsByShow(showId);
        return new ApiResponse<>(true, "Fetched available seats successfully", res);
    }

}
