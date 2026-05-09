package com.tcs.parcelX.controller;

import com.tcs.parcelX.dto.ApiResponse;
import com.tcs.parcelX.dto.FeedbackRequest;
import com.tcs.parcelX.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitFeedback(@Valid @RequestBody FeedbackRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully", feedbackService.submitFeedback(request, authentication.getName())));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @GetMapping("/{parcelId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFeedback(@PathVariable Long parcelId) {
        return ResponseEntity.ok(ApiResponse.success("Feedback fetched successfully", feedbackService.getFeedbackForParcel(parcelId)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllFeedback() {
        return ResponseEntity.ok(ApiResponse.success("All feedback fetched successfully", feedbackService.getAllFeedback()));
    }
}

