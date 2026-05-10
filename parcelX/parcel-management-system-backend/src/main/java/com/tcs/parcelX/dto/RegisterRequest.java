package com.tcs.parcelX.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "Username must be 3-20 characters and contain only letters, numbers, and underscores")
    private String username;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$", message = "Password must be at least 8 characters with uppercase, lowercase, and special character")
    private String password;

    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Full name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z ]{1,49}$", message = "Full name must contain only letters and spaces, between 2 and 50 characters")
    private String name;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Zip code must be a valid 6 digit code")
    private String zipCode;

    @Size(max = 50, message = "State must be at most 50 characters")
    private String state;

    @Size(max = 50, message = "City must be at most 50 characters")
    private String city;

    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Phone must be a valid 10 digit number starting with 6, 7, 8, or 9")
    private String phone;

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 120, message = "Address must be between 10 and 120 characters")
    private String address;

    @Pattern(regexp = "^(ADMIN|CUSTOMER)$", message = "Role must be ADMIN or CUSTOMER")
    private String role;
}
