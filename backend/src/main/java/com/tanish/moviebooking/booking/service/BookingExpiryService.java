package com.tanish.moviebooking.booking.service;

import com.tanish.moviebooking.booking.entity.Booking;
import com.tanish.moviebooking.booking.entity.BookingStatus;
import com.tanish.moviebooking.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingExpiryService {

    private final BookingRepository bookingRepository;

    @Transactional
    public void expirePendingBookings() {
        LocalDateTime  currentTime = LocalDateTime.now();
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(BookingStatus.PENDING_PAYMENT, currentTime);
        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.CANCELLED);
        }
        bookingRepository.saveAll(expiredBookings);
    }

}
