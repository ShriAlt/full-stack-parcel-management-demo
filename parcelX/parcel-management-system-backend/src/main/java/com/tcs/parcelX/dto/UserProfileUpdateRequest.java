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
    @Pattern(regexp = "^(?!.*\\.\\.)(?![0-9]+@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,63}$", message = "Email must be a valid address and cannot start with only digits")
    private String email;

    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Phone must be a valid 10 digit number starting with 6, 7, 8, or 9")
    private String phone;

    @Size(min = 10, max = 120, message = "Address must be between 10 and 120 characters")
    private String address;

    @Pattern(regexp = "^(?=.{3,50}$)[A-Za-z]+(?: [A-Za-z]+)*$", message = "City must contain only letters and single spaces, between 3 and 50 characters")
    private String city;

    @Pattern(regexp = "^(?=.{3,50}$)[A-Za-z]+(?: [A-Za-z]+)*$", message = "State must contain only letters and single spaces, between 3 and 50 characters")
    private String state;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Zip code must be a valid 6 digit code")
    private String zipCode;
}
