package com.tanish.moviebooking.seat.repository;

import com.tanish.moviebooking.seat.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByScreenIdAndActiveTrueOrderBySeatNumberAsc(Long screenId);
    long countByScreenIdAndActiveTrue(Long screenId);
    List<Seat> findByScreenIdOrderByIdAsc(Long screenId);
    boolean existsByScreenIdAndSeatNumber(Long screenId, String seatNumber);

}