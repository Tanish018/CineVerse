package com.tanish.moviebooking.booking.dto;

import com.tanish.moviebooking.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long userId;
    private Long showId;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private List<Long> seatIds;
    private LocalDateTime createdAt;

}