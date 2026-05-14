package com.tcs.parcelX.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.AssertTrue;
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

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Pattern(regexp = "^(?!.*\\.\\.)(?![0-9]+@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,63}$", message = "Email must be a valid address and cannot start with only digits")
    private String email;

    @NotBlank(message = "Full name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z ]{2,49}$", message = "Full name must contain only letters and spaces, between 3 and 50 characters")
    private String name;

    @NotBlank(message = "Zip code is required")
    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Zip code must be a valid 6 digit code")
    private String zipCode;

    @NotBlank(message = "State is required")
    @Pattern(regexp = "^(?=.{3,50}$)[A-Za-z]{3,}(?: [A-Za-z]{3,})?$", message = "State must contain only letters, each word must be at least 3 letters, and at most one single space is allowed")
    private String state;

    @NotBlank(message = "City is required")
    @Pattern(regexp = "^(?=.{3,50}$)[A-Za-z]{3,}(?: [A-Za-z]{3,})?$", message = "City must contain only letters, each word must be at least 3 letters, and at most one single space is allowed")
    private String city;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Phone must be a valid 10 digit number starting with 6, 7, 8, or 9")
    private String phone;

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 120, message = "Address must be between 10 and 120 characters")
    private String address;

    @Pattern(regexp = "^(ADMIN|CUSTOMER)$", message = "Role must be ADMIN or CUSTOMER")
    private String role;

    @AssertTrue(message = "Privacy policy must be accepted")
    private boolean acceptedPrivacyPolicy;
}
