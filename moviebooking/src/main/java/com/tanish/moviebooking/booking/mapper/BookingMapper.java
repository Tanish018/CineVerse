package com.tanish.moviebooking.booking.mapper;

import com.tanish.moviebooking.booking.dto.BookingResponse;
import com.tanish.moviebooking.booking.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .showId(booking.getShow().getId())
                .showLanguage(booking.getShow().getLanguage())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .seatIds(booking.getBookingSeats()
                        .stream().map(bookingSeat -> bookingSeat.getSeat().getId())
                        .toList()
                )
                .createdAt(booking.getCreatedAt())
                .build();
    }

}