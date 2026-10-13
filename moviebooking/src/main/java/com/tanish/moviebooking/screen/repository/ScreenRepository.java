package com.tanish.moviebooking.screen.repository;

import com.tanish.moviebooking.screen.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScreenRepository extends JpaRepository<Screen, Long> {

    List<Screen> findByTheatreIdAndActiveTrueOrderByScreenNumberAsc(Long theatreId);
    Optional<Screen> findByTheatreIdAndScreenNumber(Long theatreId, Integer screenNumber);
    long countByTheatreIdAndActiveTrue(Long theatreId);
    List<Screen> findByTheatreIdAndActiveTrueOrderByScreenNumberDesc(Long theatreId);

}