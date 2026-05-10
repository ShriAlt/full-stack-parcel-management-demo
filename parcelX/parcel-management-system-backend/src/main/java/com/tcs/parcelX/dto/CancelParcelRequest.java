package com.tcs.parcelX.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CancelParcelRequest {
    @NotNull(message = "Parcel ID is required")
    private Long parcelId;

    @NotBlank(message = "Cancellation reason is required")
    @Size(min = 5, max = 200, message = "Cancellation reason must be between 5 and 200 characters")
    private String reason;
}

