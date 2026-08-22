package com.tanish.moviebooking.booking.repository;

import com.tanish.moviebooking.booking.entity.BookingSeat;
import com.tanish.moviebooking.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    @Query("""
            SELECT bs.seat.id FROM BookingSeat bs
            WHERE bs.booking.show.id = :showId
            AND bs.booking.status IN :statuses
            AND bs.seat.id IN :seatIds
            """)
    List<Long> findBookedSeatIds(Long showId, List<BookingStatus> statuses, List<Long> seatIds);


    @Query("""
        SELECT bs.seat.id FROM BookingSeat bs
        WHERE bs.booking.show.id = :showId
        AND bs.booking.status IN :statuses
        """)
    List<Long> findBookedSeatIdsByShow(Long showId, List<BookingStatus> statuses);

}