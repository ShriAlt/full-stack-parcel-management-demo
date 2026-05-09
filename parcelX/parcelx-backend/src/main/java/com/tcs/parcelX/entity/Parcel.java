package com.tcs.parcelX.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "parcels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String trackingId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false)
    private String pickupAddress;


    @Column(nullable = false)
    private String senderName;

    @Column(nullable = false)
    private String receiverName;

    @Column(nullable = false)
    private String pickupZipCode;
    @Column(nullable = false)
    private String pickupContactInfo;
    @Column(nullable = false)
    private String dropLocation;
    @Column(nullable = false)
    private String dropZipCode;
    @Column(nullable = false)
    private String dropContactInfo;
    @Column(nullable = false)
    private Double weight;
    @Column(nullable = false)
    private String deliveryType;
    @Column(nullable = false)
    private String packagingType;
    @Column(nullable = false)
    private Double cost;
    @Column(nullable = false)
    private LocalDate pickupDate;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParcelStatus status;
    @Column
    private String cancelReason;
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @Column
    private LocalDateTime updatedAt;

    public enum ParcelStatus {
        CREATED, PENDING, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    }
}
