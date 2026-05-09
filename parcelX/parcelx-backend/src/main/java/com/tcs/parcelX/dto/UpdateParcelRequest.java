package com.tcs.parcelX.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateParcelRequest {
    @NotBlank(message = "Pickup address is required")
    @Size(min = 10, max = 120, message = "Pickup address must be between 10 and 120 characters")
    private String pickupAddress;

    @NotBlank(message = "Pickup contact info is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Pickup contact info must be a valid 10 digit phone number")
    private String pickupContactInfo;

    @NotBlank(message = "Drop location is required")
    @Size(min = 10, max = 120, message = "Drop location must be between 10 and 120 characters")
    private String dropLocation;

    @NotBlank(message = "Drop contact info is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Drop contact info must be a valid 10 digit phone number")
    private String dropContactInfo;

    @NotBlank(message = "Delivery type is required")
    @Pattern(regexp = "^(STANDARD|EXPRESS|SAME_DAY|Same Day|same-day|express|standard)$", message = "Delivery type must be STANDARD, EXPRESS, or SAME_DAY")
    private String deliveryType;

    @NotBlank(message = "Packaging type is required")
    @Pattern(regexp = "^(BASIC|PREMIUM|basic|premium)$", message = "Packaging type must be BASIC or PREMIUM")
    private String packagingType;

    @NotNull(message = "Pickup date is required")
    private LocalDate pickupDate;

    @NotBlank(message = "Sender name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z ]{1,49}$", message = "Sender name must contain only letters and spaces")
    private String senderName;

    @NotBlank(message = "Receiver name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z ]{1,49}$", message = "Receiver name must contain only letters and spaces")
    private String receiverName;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Pickup zip code must be a valid 6 digit code")
    private String pickupZipCode;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Drop zip code must be a valid 6 digit code")
    private String dropZipCode;
}

