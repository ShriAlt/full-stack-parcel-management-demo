package com.tcs.parcelX.mapper;

import com.tcs.parcelX.dto.RegisterRequest;
import com.tcs.parcelX.dto.UserProfileResponse;
import com.tcs.parcelX.dto.UserProfileUpdateRequest;
import com.tcs.parcelX.entity.User;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toEntity(RegisterRequest request, String encodedPassword, User.Role role) {
        return User.builder()
                .username(request.getUsername())
                .password(encodedPassword)
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(role)
                .zipCode(request.getZipCode())
                .state(request.getState())
                .city(request.getCity())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .role(user.getRole().toString())
                .build();
    }

    public void updateEntity(User user, UserProfileUpdateRequest request) {
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getState() != null) user.setState(request.getState());
        if (request.getZipCode() != null) user.setZipCode(request.getZipCode());
    }
}
