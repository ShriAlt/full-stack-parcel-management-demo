package com.tcs.parcelX.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDetailRequest {
    @NotNull(message = "Parcel ID is required")
    private Long parcelId;

    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "^(CREDIT_CARD|DEBIT_CARD|UPI|credit_card|debit_card|upi)$", message = "Payment method must be CREDIT_CARD, DEBIT_CARD, or UPI")
    private String method;

    @Pattern(regexp = "^[0-9]{16}$", message = "Card number must contain 16 digits")
    private String cardNumber;

    @Pattern(regexp = "^[A-Za-z][A-Za-z ]{1,49}$", message = "Cardholder name must contain only letters and spaces")
    private String cardholderName;

    @Pattern(regexp = "^(0[1-9]|1[0-2])/\\d{2}$", message = "Expiry date must use MM/YY format")
    private String expiryDate;

    @Pattern(regexp = "^[0-9]{3}$", message = "CVV must contain 3 digits")
    private String cvv;

    @Pattern(regexp = "^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$", message = "UPI ID format is invalid")
    private String upiId;
}

