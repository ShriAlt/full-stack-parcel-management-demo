package com.tcs.parcelX.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;
    @Column(nullable = false)
    private Double amount;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;
    private String transactionId;
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @Column
    private LocalDateTime updatedAt;

    public enum PaymentStatus {
        PAYMENT_PENDING, CONFIRMED, PAYMENT_FAILED
    }

    public enum PaymentMethod {
        CREDIT_CARD, DEBIT_CARD, UPI
    }
}
