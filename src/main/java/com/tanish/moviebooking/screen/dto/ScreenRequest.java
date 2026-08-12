package com.tanish.moviebooking.screen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScreenRequest {

    @NotBlank(message = "Screen name is required")
    private String name;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    @NotBlank(message = "Screen type is required")
    private String screenType;

}