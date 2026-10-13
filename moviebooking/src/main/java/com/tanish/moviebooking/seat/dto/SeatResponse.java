package com.tanish.moviebooking.seat.dto;

import com.tanish.moviebooking.seat.entity.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SeatResponse {

    private Long id;
    private Long screenId;
    private String seatNumber;
    private String rowLabel;
    private SeatType seatType;
    private Boolean active;

}