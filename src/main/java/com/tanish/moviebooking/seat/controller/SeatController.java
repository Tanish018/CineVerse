package com.tanish.moviebooking.seat.controller;

import com.tanish.moviebooking.common.ApiResponse;
import com.tanish.moviebooking.seat.dto.SeatResponse;
import com.tanish.moviebooking.seat.service.SeatService;
import lombok.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/screen/{screenId}")
    public ApiResponse<List<SeatResponse>> getSeatsByScreen(@PathVariable Long screenId) {
        List<SeatResponse> res = seatService.getSeatsByScreen(screenId);
        return new ApiResponse<>(true, "Seats fetched successfully", res);
    }

//    @PostMapping("/screen/{screenId}/generate")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ApiResponse<Void> generateSeats(@PathVariable Long screenId) {
//        seatService.generateSeats(screenId);
//        return  new ApiResponse<>(true, "Seats generated successfully", null);
//    }

}
