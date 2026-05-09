package com.tcs.parcelX.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
@Data
public class PaymentStatusUpdate {
    @NotNull(message = "Parcel ID is required")
    private Long parcelId;

    private Double amount;

    @NotBlank(message = "Payment status is required")
    @Pattern(regexp = "^(SUCCESS|FAILED|PENDING)$", message = "Payment status must be SUCCESS, FAILED, or PENDING")
    private String status; // SUCCESS, FAILED, PENDING

    @Pattern(regexp = "^[A-Za-z0-9_-]{3,80}$", message = "Transaction ID must be 3-80 letters, numbers, underscores, or hyphens")
    private String transactionId;
}
