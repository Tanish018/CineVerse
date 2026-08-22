package com.tanish.moviebooking.show.dto;

import com.tanish.moviebooking.seat.entity.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class ShowSeatResponse {

    private Long seatId;
    private String seatNumber;
    private String rowLabel;
    private SeatType seatType;
    private BigDecimal price;
    private Boolean available;

}