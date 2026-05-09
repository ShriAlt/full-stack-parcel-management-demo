package com.tcs.parcelX.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
@Data
public class AuthRequest {
    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "Username must be 3-20 characters and contain only letters, numbers, and underscores")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
