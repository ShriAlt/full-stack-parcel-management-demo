package com.tcs.parcelX.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {
    private Long parcelId;
    private String trackingId;
    private String sender;
    private String pickupAddress;
    private String dropLocation;
    private Double weight;
    private String deliveryType;
    private String packagingType;
    private Double cost;
    private String status;
    private String createdAt;
}

