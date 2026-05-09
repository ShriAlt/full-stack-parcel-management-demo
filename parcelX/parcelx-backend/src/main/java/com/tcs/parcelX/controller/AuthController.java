package com.tcs.parcelX.controller;
import com.tcs.parcelX.dto.ApiResponse;
import com.tcs.parcelX.dto.AuthRequest;
import com.tcs.parcelX.dto.RegisterRequest;
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
}
