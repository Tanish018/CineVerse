package com.tanish.moviebooking.booking.scheduler;

import com.tanish.moviebooking.booking.service.BookingExpiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingExpiryScheduler {

    private final BookingExpiryService bookingExpiryService;

    @Scheduled(fixedRate = 60000)
    public void expirePendingBookings() {
        bookingExpiryService.expirePendingBookings();
    }

}