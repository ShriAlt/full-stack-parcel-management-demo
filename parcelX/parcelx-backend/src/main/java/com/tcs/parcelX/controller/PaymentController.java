package com.tcs.parcelX.controller;

import com.tcs.parcelX.dto.ApiResponse;
import com.tcs.parcelX.dto.PaymentDetailRequest;
import com.tcs.parcelX.dto.PaymentStatusUpdate;
import com.tcs.parcelX.entity.Payment;
import com.tcs.parcelX.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validatePayment(@Valid @RequestBody PaymentDetailRequest request) {
        Payment payment = paymentService.validateAndProcessPayment(request);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("paymentId", payment.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment details validated successfully", response));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/update-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateStatus(@Valid @RequestBody PaymentStatusUpdate request) {
        Payment payment = paymentService.updatePaymentStatus(request);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", payment.getId());
        response.put("parcelId", payment.getParcel().getId());
        response.put("amount", payment.getAmount());
        response.put("status", payment.getStatus());
        response.put("transactionId", payment.getTransactionId());
        return ResponseEntity.ok(ApiResponse.success("Payment status updated successfully", response));
    }
}

