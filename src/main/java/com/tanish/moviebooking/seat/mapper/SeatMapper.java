package com.tanish.moviebooking.seat.mapper;

import com.tanish.moviebooking.seat.dto.SeatResponse;
import com.tanish.moviebooking.seat.entity.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {

    public SeatResponse toResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .screenId(seat.getScreen().getId())
                .seatNumber(seat.getSeatNumber())
                .rowLabel(seat.getRowLabel())
                .seatType(seat.getSeatType())
                .active(seat.getActive())
                .build();
    }

}