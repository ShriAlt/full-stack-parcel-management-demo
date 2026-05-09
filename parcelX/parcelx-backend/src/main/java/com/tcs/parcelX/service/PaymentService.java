package com.tcs.parcelX.service;

import com.tcs.parcelX.dto.PaymentDetailRequest;
import com.tcs.parcelX.dto.PaymentStatusUpdate;
import com.tcs.parcelX.entity.Parcel;
import com.tcs.parcelX.entity.Payment;
import com.tcs.parcelX.exception.BadRequestException;
import com.tcs.parcelX.exception.ParcelNotFoundException;
import com.tcs.parcelX.repository.ParcelRepository;
import com.tcs.parcelX.repository.PaymentRepository;
import com.tcs.parcelX.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ParcelRepository parcelRepository;

    public Payment validateAndProcessPayment(PaymentDetailRequest request) {
        Parcel parcel = parcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));

        Payment.PaymentMethod method;
        try {
            method = Payment.PaymentMethod.valueOf(request.getMethod().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid payment method");
        }

        switch (method) {
            case CREDIT_CARD:
            case DEBIT_CARD:
                validateCardDetails(request);
                break;
            case UPI:
                validateUPI(request);
                break;
        }

        Payment payment = Payment.builder()
                .parcel(parcel)
                .amount(parcel.getCost())
                .method(method)
                .status(Payment.PaymentStatus.PAYMENT_PENDING)
                .transactionId("TXN-" + System.currentTimeMillis())
                .createdAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    private void validateCardDetails(PaymentDetailRequest request) {
        if (request.getCardNumber() == null || !ValidationUtil.isValidCardNumber(request.getCardNumber())) {
            throw new BadRequestException("Invalid card number");
        }
        if (request.getCvv() == null || !ValidationUtil.isValidCVV(request.getCvv())) {
            throw new BadRequestException("Invalid CVV");
        }
        if (request.getExpiryDate() == null || !ValidationUtil.isValidExpiryDate(request.getExpiryDate())) {
            throw new BadRequestException("Invalid expiry date");
        }
        if (request.getCardholderName() == null || request.getCardholderName().trim().isEmpty()) {
            throw new BadRequestException("Invalid cardholder name");
        }
    }

    private void validateUPI(PaymentDetailRequest request) {
        if (request.getUpiId() == null || !ValidationUtil.isValidUPI(request.getUpiId())) {
            throw new BadRequestException("Invalid UPI ID");
        }
    }

    public Payment updatePaymentStatus(PaymentStatusUpdate request) {
        if (request.getParcelId() == null) {
            throw new BadRequestException("Parcel ID is required");
        }

        Parcel parcel = parcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));

        Payment payment = paymentRepository.findByParcelId(parcel.getId())
                .orElseGet(() -> Payment.builder()
                        .parcel(parcel)
                        .createdAt(LocalDateTime.now())
                        .build());

        payment.setParcel(parcel);
        payment.setAmount(request.getAmount() != null ? request.getAmount() : parcel.getCost());
        payment.setStatus(mapStatus(request.getStatus()));
        payment.setTransactionId(request.getTransactionId());
        payment.setUpdatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    private Payment.PaymentStatus mapStatus(String status) {
        if (status == null) {
            return Payment.PaymentStatus.PAYMENT_PENDING;
        }

        return switch (status.toUpperCase()) {
            case "SUCCESS" -> Payment.PaymentStatus.CONFIRMED;
            case "FAILED" -> Payment.PaymentStatus.PAYMENT_FAILED;
            default -> Payment.PaymentStatus.PAYMENT_PENDING;
        };
    }
}

