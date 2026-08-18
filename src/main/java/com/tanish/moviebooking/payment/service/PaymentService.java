package com.tanish.moviebooking.payment.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.tanish.moviebooking.booking.entity.Booking;
import com.tanish.moviebooking.booking.entity.BookingStatus;
import com.tanish.moviebooking.booking.repository.BookingRepository;
import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.payment.dto.PaymentResponse;
import com.tanish.moviebooking.payment.entity.Payment;
import com.tanish.moviebooking.payment.entity.PaymentStatus;
import com.tanish.moviebooking.payment.mapper.PaymentMapper;
import com.tanish.moviebooking.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;

    @Value("${stripe.secret_key}")
    private String stripeSecretKey;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    private Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not Found : " + id));
    }

    private Long toSmallestUnit(BigDecimal amount) {
        return amount.movePointRight(2).longValueExact();
    }

    @Transactional
    public PaymentResponse createCheckoutSession(Long bookingId) {
        Booking booking = getBooking(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Payment cannot be created for this booking");
        }
        if (paymentRepository.existsByBookingIdAndStatus(bookingId, PaymentStatus.SUCCESS)) {
            throw new BadRequestException("Payment has already been completed for this booking");
        }
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseGet(() ->
                    Payment.builder()
                            .booking(booking)
                            .amount(booking.getTotalAmount())
                            .currency("INR")
                            .status(PaymentStatus.PENDING)
                            .build()
                );
        try {
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName("Movie Booking # " + booking.getId()).build();

            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("inr").setUnitAmount(toSmallestUnit(booking.getTotalAmount()))
                            .setProductData(productData).build();

            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(1L).setPriceData(priceData).build();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .setClientReferenceId(booking.getId().toString())
                    .putMetadata("bookingId", booking.getId().toString())
                    .addLineItem(lineItem)
                    .build();

            com.stripe.Stripe.apiKey = stripeSecretKey;
            Session session = Session.create(params);
            payment.setStripeSessionId(session.getId());
            Payment savedPayment = paymentRepository.save(payment);
            return paymentMapper.toResponse(savedPayment, session.getUrl());

        } catch (StripeException e) {
            throw new BadRequestException("Unable to create Stripe checkout session");
        }
    }

    @Transactional
    public void handleCheckoutCompleted(String stripeSessionId) {
        Payment payment = paymentRepository.findByStripeSessionId(stripeSessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for Stripe session"));
        if (payment.getStatus() ==  PaymentStatus.SUCCESS) {
            return;
        }
        payment.setStatus(PaymentStatus.SUCCESS);
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        paymentRepository.save(payment);
        bookingRepository.save(booking);
    }

    @Transactional
    public void handleCheckoutExpired(String stripeSessionId) {
        Payment payment = paymentRepository.findByStripeSessionId(stripeSessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for Stripe session"));
        if (payment.getStatus() ==  PaymentStatus.SUCCESS) {
            return;
        }
        payment.setStatus(PaymentStatus.CANCELED);
        Booking booking = payment.getBooking();
        if (booking.getStatus() == BookingStatus.PENDING_PAYMENT) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }
        paymentRepository.save(payment);
    }

}