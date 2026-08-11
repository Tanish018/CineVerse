package com.tanish.moviebooking.movie.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieRequest {

    @NotBlank(message = "Title is Required")
    private String title;

    private String description;

    @NotBlank(message = "Genre is Required")
    private String genre;

    @NotBlank(message = "Language is Required")
    private String language;

    @NotNull(message = "Duration is Required")
    @Min(value = 1, message = "Duration must be greater than 0")
    private Integer durationMinutes;

    @NotNull(message = "Release date is required")
    private LocalDate releaseDate;

    private String posterUrl;

}