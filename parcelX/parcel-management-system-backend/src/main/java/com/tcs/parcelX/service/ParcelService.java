package com.tcs.parcelX.service;
import com.tcs.parcelX.dto.*;
import com.tcs.parcelX.dto.*;
import com.tcs.parcelX.entity.Parcel;
import com.tcs.parcelX.entity.Payment;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.exception.BadRequestException;
import com.tcs.parcelX.exception.ParcelNotFoundException;
import com.tcs.parcelX.exception.UnauthorizedException;
import com.tcs.parcelX.exception.UserNotFoundException;
import com.tcs.parcelX.mapper.ParcelMapper;
import com.tcs.parcelX.repository.ParcelRepository;
import com.tcs.parcelX.repository.PaymentRepository;
import com.tcs.parcelX.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ParcelService {
    @Autowired
    private ParcelRepository parcelRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ParcelMapper parcelMapper;
    @Autowired
    private PaymentRepository paymentRepository;

    private static final double BASE_RATE = 50.0;
    private static final double COST_PER_GRAM = 0.02;
    private static final double TAX_RATE = 0.05;

    public ParcelResponse bookParcel(BookParcelRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        double cost = calculateServiceCost(request.getWeight(), request.getDeliveryType(), request.getPackagingType());
        String trackingId = generateTrackingId();
        String deliveryType = normalizeDeliveryType(request.getDeliveryType());
        String packagingType = normalizePackagingType(request.getPackagingType());

        Parcel parcel = parcelMapper.toEntity(request, user, trackingId, cost, deliveryType, packagingType);

        Parcel saved = parcelRepository.save(parcel);
        if (User.Role.ADMIN.equals(user.getRole())) {
            markAdminBookingAsPaid(saved);
        }
        return parcelMapper.toResponse(saved);
    }

    public List<ParcelResponse> listParcelsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return parcelRepository.findBySenderId(user.getId())
                .stream()
                .map(parcelMapper::toResponse)
                .collect(Collectors.toList());
    }

    public TrackingResponse trackByTrackingId(String trackingId) {
        Parcel parcel = parcelRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));
        return parcelMapper.toTrackingResponse(parcel);
    }

    public ParcelResponse trackParcel(Long id) {
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));
        return parcelMapper.toResponse(parcel);
    }

    public ParcelResponse updateParcel(Long id, UpdateParcelRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));

        if (!parcel.getSender().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        if (!Parcel.ParcelStatus.CREATED.equals(parcel.getStatus())) {
            throw new BadRequestException("Can only update parcels in CREATED status");
        }

        String deliveryType = normalizeDeliveryType(request.getDeliveryType());
        String packagingType = normalizePackagingType(request.getPackagingType());
        double cost = calculateServiceCost(parcel.getWeight(), deliveryType, packagingType);
        parcelMapper.updateEntity(parcel, request, cost, deliveryType, packagingType);

        Parcel updated = parcelRepository.save(parcel);
        return parcelMapper.toResponse(updated);
    }

    public ParcelResponse cancelParcel(Long id, CancelParcelRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));

        if (!parcel.getSender().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        parcel.setStatus(Parcel.ParcelStatus.CANCELLED);
        parcel.setCancelReason(request.getReason());
        parcel.setUpdatedAt(LocalDateTime.now());

        Parcel updated = parcelRepository.save(parcel);
        return parcelMapper.toResponse(updated);
    }

    public List<ParcelResponse> getAllParcels() {
        return parcelRepository.findAll()
                .stream()
                .map(parcelMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ParcelResponse updateParcelStatus(Long id, String status) {
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));
        try {
            parcel.setStatus(Parcel.ParcelStatus.valueOf(status));
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new BadRequestException("Invalid parcel status");
        }
        parcel.setUpdatedAt(LocalDateTime.now());
        Parcel updated = parcelRepository.save(parcel);
        return parcelMapper.toResponse(updated);
    }

    public InvoiceResponse generateInvoice(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));

        if (!parcel.getSender().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        return parcelMapper.toInvoiceResponse(parcel);
    }

    private String generateTrackingId() {
        return "TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void markAdminBookingAsPaid(Parcel parcel) {
        paymentRepository.save(Payment.builder()
                .parcel(parcel)
                .amount(parcel.getCost())
                .method(Payment.PaymentMethod.UPI)
                .status(Payment.PaymentStatus.CONFIRMED)
                .transactionId("ADMIN-" + System.currentTimeMillis())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());
    }

    private double calculateServiceCost(Double weightInGrams, String deliveryType, String packagingType) {
        double weight = weightInGrams != null ? weightInGrams : 0.0;
        double subtotal = BASE_RATE + (COST_PER_GRAM * weight) + getDeliveryCharge(deliveryType) + getPackagingCharge(packagingType);
        return Math.round(subtotal * (1 + TAX_RATE) * 100.0) / 100.0;
    }

    private double getDeliveryCharge(String deliveryType) {
        return switch (normalizeDeliveryType(deliveryType)) {
            case "EXPRESS" -> 80.0;
            case "SAME_DAY" -> 150.0;
            default -> 30.0;
        };
    }

    private double getPackagingCharge(String packagingType) {
        return "PREMIUM".equals(normalizePackagingType(packagingType)) ? 30.0 : 10.0;
    }

    private String normalizeDeliveryType(String deliveryType) {
        if (deliveryType == null || deliveryType.isBlank()) {
            return "STANDARD";
        }
        String normalized = deliveryType.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        if (normalized.contains("SAME")) return "SAME_DAY";
        if (normalized.contains("EXPRESS")) return "EXPRESS";
        return "STANDARD";
    }

    private String normalizePackagingType(String packagingType) {
        if (packagingType == null || packagingType.isBlank()) {
            return "BASIC";
        }
        return packagingType.trim().toUpperCase().contains("PREMIUM") ? "PREMIUM" : "BASIC";
    }
}
