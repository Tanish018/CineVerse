package com.tanish.moviebooking.show.repository;

import com.tanish.moviebooking.show.entity.Show;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ShowRepository {

    List<Show> findByScreenIdAndActiveTrueOrderByShowDateAscStartTimeAsc(Long screenId);
    List<Show> findByScreenIdAndShowDateAndActiveTrueOrderByStartTimeAsc(Long screenId, LocalDate showDate);
    List<Show> findByMovieIdAndActiveTrueOrderByShowDateAscStartTimeAsc(Long movieId);
    List<Show> findByMovieIdAndShowDateAndActiveTrueOrderByStartTimeAsc(Long movieId, LocalDate showDate);
    @Query("""
            SELECT COUNT(s) > 0 FROM Show s
            WHERE s.screen.id = :screenId
            AND s.showDate = :showDate
            AND s.active = true
            AND s.startTime < :endTime
            AND s.endTime > :startTime
            """)
    boolean existsOverlappingShow(Long screenId, LocalDate showDate, LocalTime startTime,LocalTime endTime);

}