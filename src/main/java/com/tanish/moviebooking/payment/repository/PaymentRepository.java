package com.tanish.moviebooking.payment.repository;

import com.tanish.moviebooking.payment.entity.Payment;
import com.tanish.moviebooking.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByStripeSessionId(Long stripeSessionId);
    boolean existsByBookingIdAndStatus(Long bookingId, PaymentStatus status);

}