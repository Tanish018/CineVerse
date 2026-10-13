package com.tanish.moviebooking.show.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ShowSearchRequest {

    private String city;
    private Long theatreId;
    private Long movieId;
    private LocalDate showDate;

}
