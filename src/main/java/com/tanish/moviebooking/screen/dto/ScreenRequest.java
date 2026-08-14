package com.tanish.moviebooking.screen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScreenRequest {

    @NotNull(message = "Screen number is required")
    @Min(value = 1, message = "Screen number must be at least 1")
    private Integer screenNumber;

    @NotBlank(message = "Screen name is required")
    private String name;

    @NotNull(message = "Regular seat count is required")
    @Min(value = 0, message = "Regular seat count cannot be negative")
    private Integer regularSeats;

    @NotNull(message = "Premium seat count is required")
    @Min(value = 0, message = "Premium seat count cannot be negative")
    private Integer premiumSeats;

    @NotNull(message = "Recliner seat count is required")
    @Min(value = 0, message = "Recliner seat count cannot be negative")
    private Integer reclinerSeats;

    @NotBlank(message = "Screen type is required")
    private String screenType;

}