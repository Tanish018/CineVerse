package com.tanish.moviebooking.payment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull(message = "Booking Id is required")
    private Long bookingId;

}