package com.tcs.parcelX.controller;
import com.tcs.parcelX.dto.ApiResponse;
import com.tcs.parcelX.dto.AuthRequest;
import com.tcs.parcelX.dto.ForgotPasswordRequest;
import com.tcs.parcelX.dto.RegisterRequest;
import com.tcs.parcelX.dto.ResetPasswordRequest;
import com.tcs.parcelX.dto.VerifyResetOtpRequest;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.security.JwtUtil;
import com.tcs.parcelX.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping(value="/register",produces="application/json")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.registerUser(request);
        return ResponseEntity.ok(ApiResponse.<Void>success("User registered successfully", null));
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody AuthRequest request) {
        User user = authService.validateLogin(request);
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole().name());
        response.put("token", jwtUtil.generateToken(user.getUsername(), user.getRole().name()));
        response.put("tokenType", "Bearer");
        response.put("expiresIn", jwtUtil.getExpirationMs());
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.sendPasswordResetOtp(request);
        return ResponseEntity.ok(ApiResponse.<Void>success("OTP sent to registered email", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>success("Password reset successfully", null));
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<ApiResponse<Void>> verifyResetOtp(@Valid @RequestBody VerifyResetOtpRequest request) {
        authService.verifyResetOtp(request);
        return ResponseEntity.ok(ApiResponse.<Void>success("OTP verified successfully", null));
    }
}
