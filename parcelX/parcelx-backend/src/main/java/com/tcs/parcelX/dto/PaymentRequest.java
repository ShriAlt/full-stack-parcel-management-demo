package com.tcs.parcelX.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class PaymentRequest {
    @NotNull(message = "Parcel ID is required")
    private Long parcelId;

    @NotNull(message = "Amount is required")
    private Double amount;
}
