package com.tanish.moviebooking.booking.entity;

import com.tanish.moviebooking.seat.entity.Seat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "booking_seats", uniqueConstraints = {
            @UniqueConstraint(
                    name = "uk_booking_seats",
                    columnNames = {"booking_id", "seat_id"}
            )
       }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,  optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY,  optional = false)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

}