package com.tanish.moviebooking.payment.controller;

import com.tanish.moviebooking.common.ApiResponse;
import com.tanish.moviebooking.payment.dto.PaymentRequest;
import com.tanish.moviebooking.payment.dto.PaymentResponse;
import com.tanish.moviebooking.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ApiResponse<PaymentResponse> createCheckoutSession(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse res = paymentService.createCheckoutSession(request.getBookingId());
        return new ApiResponse<>(true, "Stripe checkout session created successfully", res);
    }

}