package com.tcs.parcelX.service;

import com.tcs.parcelX.dto.PaymentDetailRequest;
import com.tcs.parcelX.dto.PaymentStatusUpdate;
import com.tcs.parcelX.entity.DemoCard;
import com.tcs.parcelX.entity.Parcel;
import com.tcs.parcelX.entity.Payment;
import com.tcs.parcelX.exception.BadRequestException;
import com.tcs.parcelX.exception.ParcelNotFoundException;
import com.tcs.parcelX.repository.DemoCardRepository;
import com.tcs.parcelX.repository.ParcelRepository;
import com.tcs.parcelX.repository.PaymentRepository;
import com.tcs.parcelX.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ParcelRepository parcelRepository;

    @Autowired
    private DemoCardRepository demoCardRepository;

    @Transactional
    public Payment validateAndProcessPayment(PaymentDetailRequest request) {
        Parcel parcel = parcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));

        Payment.PaymentMethod method;
        try {
            method = Payment.PaymentMethod.valueOf(request.getMethod().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid payment method");
        }

        DemoCard demoCard = null;
        switch (method) {
            case CREDIT_CARD:
            case DEBIT_CARD:
                demoCard = validateCardDetails(request, parcel.getCost());
                break;
            case UPI:
                validateUPI(request);
                break;
        }

        Payment payment = paymentRepository.findByParcelId(parcel.getId())
                .orElseGet(() -> Payment.builder()
                        .parcel(parcel)
                        .createdAt(LocalDateTime.now())
                        .build());
        if (payment.getStatus() == Payment.PaymentStatus.CONFIRMED) {
            throw new BadRequestException("Payment is already confirmed for this parcel");
        }
        payment.setParcel(parcel);
        payment.setDemoCard(demoCard);
        payment.setAmount(parcel.getCost());
        payment.setMethod(method);
        payment.setStatus(Payment.PaymentStatus.PAYMENT_PENDING);
        payment.setTransactionId("TXN-" + System.currentTimeMillis());
        payment.setUpdatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    private DemoCard validateCardDetails(PaymentDetailRequest request, Double amount) {
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

        DemoCard demoCard = demoCardRepository.findByCardNumber(request.getCardNumber())
                .filter(DemoCard::isActive)
                .orElseThrow(() -> new BadRequestException("This card is not available in the demo card list"));

        if (!demoCard.getCardholderName().equalsIgnoreCase(request.getCardholderName().trim())
                || !demoCard.getExpiryDate().equals(request.getExpiryDate())
                || !demoCard.getCvv().equals(request.getCvv())) {
            throw new BadRequestException("Card details do not match any valid demo card");
        }
        if (demoCard.getBalance() == null || demoCard.getBalance() < amount) {
            throw new BadRequestException("Insufficient demo card balance");
        }

        return demoCard;
    }

    private void validateUPI(PaymentDetailRequest request) {
        if (request.getUpiId() == null || !ValidationUtil.isValidUPI(request.getUpiId())) {
            throw new BadRequestException("Invalid UPI ID");
        }
    }

    @Transactional
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
        Payment.PaymentStatus previousStatus = payment.getStatus();

        payment.setParcel(parcel);
        payment.setAmount(request.getAmount() != null ? request.getAmount() : parcel.getCost());
        payment.setStatus(mapStatus(request.getStatus()));
        payment.setTransactionId(request.getTransactionId());
        payment.setUpdatedAt(LocalDateTime.now());

        if (payment.getStatus() == Payment.PaymentStatus.CONFIRMED
                && previousStatus != Payment.PaymentStatus.CONFIRMED
                && payment.getDemoCard() != null) {
            DemoCard demoCard = payment.getDemoCard();
            if (demoCard.getBalance() == null || demoCard.getBalance() < payment.getAmount()) {
                payment.setStatus(Payment.PaymentStatus.PAYMENT_FAILED);
                paymentRepository.save(payment);
                throw new BadRequestException("Insufficient demo card balance");
            }
            demoCard.setBalance(demoCard.getBalance() - payment.getAmount());
            demoCardRepository.save(demoCard);
        }

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

