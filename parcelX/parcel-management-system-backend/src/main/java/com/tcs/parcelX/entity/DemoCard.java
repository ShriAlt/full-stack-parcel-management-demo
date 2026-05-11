package com.tcs.parcelX.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "demo_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemoCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 16)
    private String cardNumber;

    @Column(nullable = false)
    private String cardholderName;

    @Column(nullable = false, length = 5)
    private String expiryDate;

    @Column(nullable = false, length = 3)
    private String cvv;

    @Column(nullable = false)
    private Double balance;

    @Column(nullable = false)
    private boolean active;
}
