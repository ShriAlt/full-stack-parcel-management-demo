package com.tcs.parcelX.dto;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcelResponse {
    private Long id;
    private String trackingId;
    private String senderName;
    private String senderUsername;
    private String senderEmail;
    private String senderPhone;
    private String senderAddress;
    private String pickupAddress;
    private String pickupContactInfo;
    private String dropLocation;
    private String dropContactInfo;
    private Double weight;
    private String deliveryType;
    private String packagingType;
    private Double cost;
    private LocalDate pickupDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String receiverName;

    private String pickupZipCode;
    private String dropZipCode;
    private String paymentStatus;
    private String paymentMethod;
    private String transactionId;
}

