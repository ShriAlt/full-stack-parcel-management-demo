package com.tcs.parcelX.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileUpdateRequest {
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Phone must be a valid 10 digit number starting with 6, 7, 8, or 9")
    private String phone;

    @Size(min = 10, max = 120, message = "Address must be between 10 and 120 characters")
    private String address;

    @Size(max = 50, message = "City must be at most 50 characters")
    private String city;

    @Size(max = 50, message = "State must be at most 50 characters")
    private String state;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Zip code must be a valid 6 digit code")
    private String zipCode;
}

