package com.tanish.moviebooking.screen.entity;

import com.tanish.moviebooking.theatre.entity.Theatre;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "screens",
        uniqueConstraints = {@UniqueConstraint(
                name = "uk_theatre_screen_number",
                columnNames = {"theatre_id","screen_number"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Screen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,  optional = false)
    @JoinColumn(name = "theatre_id", nullable = false)
    private Theatre theatre;

    @Column(name = "screen_number", nullable = false)
    private Integer screenNumber;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "regular_seats", nullable = false)
    private Integer regularSeats;

    @Column(name = "premium_seats", nullable = false)
    private Integer premiumSeats;

    @Column(name = "recliner_seats", nullable = false)
    private Integer reclinerSeats;

    @Column(nullable = false)
    private String screenType;

    @Column(nullable = false)
    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) active = true;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
