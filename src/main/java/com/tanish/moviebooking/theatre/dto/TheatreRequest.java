package com.tanish.moviebooking.theatre.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TheatreRequest {

    @NotBlank(message = "Theatre name is required")
    private String name;

    @NotBlank(message = "City name is required")
    private String city;

    @NotBlank(message = "Address is required")
    private String address;

    private String pincode;
}