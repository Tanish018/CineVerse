package com.tanish.moviebooking.theatre.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TheatreResponse {

    private Long id;
    private String name;
    private String city;
    private String address;
    private String pincode;
    private Boolean active;

}