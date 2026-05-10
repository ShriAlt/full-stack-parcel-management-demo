package com.tcs.parcelX.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class CreateParcelRequest {
    @NotBlank(message = "Receiver is required")
    @Size(min = 2, max = 50, message = "Receiver must be between 2 and 50 characters")
    private String receiver;

    @NotNull(message = "Cost is required")
    private Double cost;
}
