package com.tanish.moviebooking.payment.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.tanish.moviebooking.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final PaymentService paymentService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature")  String signature) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Invalid Stripe signature");
        }
        switch (event.getType()) {
            case "checkout.session.completed":
                StripeObject stripeObject = event.getDataObjectDeserializer().getObject().orElse(null);
                if (stripeObject instanceof Session session) {
                    if ("paid".equals(session.getPaymentStatus())) {
                        paymentService.handleCheckoutCompleted(session.getId());
                    }
                }
                break;

            case "checkout.session.expired":
                StripeObject expiredObject = event.getDataObjectDeserializer().getObject().orElse(null);
                if (expiredObject instanceof Session session) {
                    paymentService.handleCheckoutExpired(session.getId());
                }
                break;

            default: break;
        }
        return ResponseEntity.ok("Webhook Received Successfully");
    }

}