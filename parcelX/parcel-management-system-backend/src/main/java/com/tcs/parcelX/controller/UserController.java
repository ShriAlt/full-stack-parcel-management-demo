package com.tcs.parcelX.controller;

import com.tcs.parcelX.dto.ApiResponse;
import com.tcs.parcelX.dto.UserProfileResponse;
import com.tcs.parcelX.dto.UserProfileUpdateRequest;
import com.tcs.parcelX.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", userService.getProfile(authentication.getName())));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@Valid @RequestBody UserProfileUpdateRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("User profile updated successfully", userService.updateProfile(authentication.getName(), request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("All users fetched successfully", userService.getAllUsers()));
    }
}
