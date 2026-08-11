package com.tanish.moviebooking.movie.repository;

import com.tanish.moviebooking.movie.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    boolean existsByTitleIgnoreCase(String title);
    List<Movie> findByActiveTrueOrderByReleaseDateDesc(String title);

}
