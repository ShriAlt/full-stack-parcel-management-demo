package com.tcs.parcelX.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingResponse {
    private String trackingId;
    private String status;
    private String deliveryType;
    private String packagingType;
    private String message;
}

