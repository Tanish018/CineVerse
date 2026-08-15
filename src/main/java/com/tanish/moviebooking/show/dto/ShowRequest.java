package com.tanish.moviebooking.show.dto;

import com.tanish.moviebooking.screen.entity.Screen;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowRequest {

    @NotNull(message = "Movie is required")
    private Long movieId;

    @NotNull(message = "Screen is required")
    private Long screenId;

    @NotNull(message = "Show date is required")
    private LocalDate showDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Regular price is required")
    @DecimalMin(value = "0.0", message = "Regular price cannot be negative")
    private BigDecimal regularPrice;

    @NotNull(message = "Premium price is required")
    @DecimalMin(value = "0.0", message = "Premium price cannot be negative")
    private BigDecimal premiumPrice;

    @NotNull(message = "Recliner price is required")
    @DecimalMin(value = "0.0", message = "Recliner price cannot be negative")
    private BigDecimal reclinerPrice;

}
