package com.tanish.moviebooking.theatre.repository;

import com.tanish.moviebooking.theatre.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TheatreRepository extends JpaRepository<Theatre,Long> {

    boolean existsByNameIgnoreCaseAndCityIgnoreCaseAndActiveTrue(String name,String city);
    List<Theatre> findByActiveTrueOrderByNameAsc();
    List<Theatre> findByCityIgnoreCaseAndActiveTrueOrderByNameAsc(String city);

}