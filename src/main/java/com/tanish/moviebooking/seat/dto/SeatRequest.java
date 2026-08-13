package com.tanish.moviebooking.seat.dto;

import com.tanish.moviebooking.seat.entity.SeatType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatRequest {

    @NotNull(message = "Seat Type is Required")
    private SeatType seatType;

}
