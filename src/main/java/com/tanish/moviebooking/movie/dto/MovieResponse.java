package com.tanish.moviebooking.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Builder
public class MovieResponse {

    private Long id;
    private String title;
    private String description;
    private String genre;
    private String language;
    private Integer durationMinutes;
    private LocalDate releaseDate;
    private String posterUrl;
    private String heroImageUrl;
    private Boolean active;

}
