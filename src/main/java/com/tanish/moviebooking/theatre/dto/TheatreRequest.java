package com.tanish.moviebooking.theatre.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TheatreRequest {

    @NotBlank(message = "Theatre name is required")
    private String name;

    @NotBlank(message = "City name is required")
    private String city;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Number of Screens are required")
    @Min(value = 1, message = "Theatre must have at least one screen")
    private Integer numberOfScreens;

    private String pincode;
}