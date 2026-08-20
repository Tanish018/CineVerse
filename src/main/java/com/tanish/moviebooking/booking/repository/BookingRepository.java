package com.tanish.moviebooking.booking.repository;

import com.tanish.moviebooking.booking.entity.Booking;
import com.tanish.moviebooking.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(long userId, BookingStatus status);
    List<Booking> findByShowIdAndStatus(long showId, BookingStatus status);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

}