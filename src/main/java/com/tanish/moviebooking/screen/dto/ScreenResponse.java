package com.tanish.moviebooking.screen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ScreenResponse {

    private Long id;
    private Long theatreId;
    private Integer screenNumber;
    private String name;
    private Integer capacity;
    private String screenType;
    private Boolean active;

}