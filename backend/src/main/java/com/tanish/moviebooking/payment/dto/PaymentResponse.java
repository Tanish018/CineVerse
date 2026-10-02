package com.tanish.moviebooking.payment.dto;

import com.tanish.moviebooking.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long bookingId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String checkoutUrl;

}