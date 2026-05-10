package com.tcs.parcelX.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "parcel_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcelStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Parcel.ParcelStatus status;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
