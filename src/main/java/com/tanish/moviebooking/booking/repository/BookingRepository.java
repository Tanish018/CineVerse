package com.tanish.moviebooking.booking.repository;

import com.tanish.moviebooking.booking.entity.Booking;
import com.tanish.moviebooking.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(long userId, BookingStatus status);
    List<Booking> findByShowIdAndStatus(long showId, BookingStatus status);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByShowIdOrderByCreatedAtDesc(long showId);

    @Query("""
        SELECT b from Booking b Join b.show s Join s.screen sc Join sc.theatre t
        WHERE (:theatreId IS NULL OR t.id = :theatreId)
        AND (:city IS NULL OR LOWER(t.city) = LOWER(:city))
        AND (:movieId IS NULL OR s.movieId = :movieId)
        AND (:showDate IS NULL OR s.showDate = :showDate )
        AND (:bookingStatus IS NULL OR b.status = :bookingStatus)
        ORDER BY b.createdAt DESC
        """)
    List<Booking> searchBookings(Long theatreId, String city, Long movieId, LocalDate showDate, BookingStatus bookingStatus);

}