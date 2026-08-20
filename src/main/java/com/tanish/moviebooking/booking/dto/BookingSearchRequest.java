package com.tanish.moviebooking.booking.dto;

import com.tanish.moviebooking.booking.entity.BookingStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingSearchRequest {

    private Long theatreId;
    private String city;
    private Long movieId;
    private LocalDate showDate;
    private BookingStatus bookingStatus;

}
