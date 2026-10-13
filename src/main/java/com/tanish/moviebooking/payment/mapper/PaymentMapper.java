package com.tanish.moviebooking.payment.mapper;

import com.tanish.moviebooking.payment.dto.PaymentRequest;
import com.tanish.moviebooking.payment.dto.PaymentResponse;
import com.tanish.moviebooking.payment.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment, String checkoutUrl) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .checkoutUrl(checkoutUrl)
                .build();
    }

}