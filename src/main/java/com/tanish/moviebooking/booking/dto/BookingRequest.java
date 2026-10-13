package com.tanish.moviebooking.booking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {

    @NotNull(message = "User is required")
    private Long userId;

    @NotNull(message = "Show is required")
    private Long showId;

    @NotEmpty(message = "At least 1 Seat is required")
    private List<Long> seatIds;

}