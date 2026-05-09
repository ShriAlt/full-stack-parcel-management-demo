package com.tcs.parcelX.mapper;

import com.tcs.parcelX.dto.BookParcelRequest;
import com.tcs.parcelX.dto.InvoiceResponse;
import com.tcs.parcelX.dto.ParcelResponse;
import com.tcs.parcelX.dto.TrackingResponse;
import com.tcs.parcelX.dto.UpdateParcelRequest;
import com.tcs.parcelX.entity.Parcel;
import com.tcs.parcelX.entity.Payment;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.repository.PaymentRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class ParcelMapper {
    private final PaymentRepository paymentRepository;

    public ParcelMapper(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Parcel toEntity(
            BookParcelRequest request,
            User sender,
            String trackingId,
            double cost,
            String deliveryType,
            String packagingType) {
        return Parcel.builder()
                .trackingId(trackingId)
                .sender(sender)
                .pickupAddress(request.getPickupAddress())
                .pickupZipCode(request.getPickupZipCode())
                .dropZipCode(request.getDropZipCode())
                .senderName(request.getSenderName())
                .receiverName(request.getReceiverName())
                .pickupContactInfo(request.getPickupContactInfo())
                .dropLocation(request.getDropLocation())
                .dropContactInfo(request.getDropContactInfo())
                .weight(request.getWeight())
                .deliveryType(deliveryType)
                .packagingType(packagingType)
                .cost(cost)
                .pickupDate(request.getPickupDate())
                .status(Parcel.ParcelStatus.CREATED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void updateEntity(Parcel parcel, UpdateParcelRequest request, double cost, String deliveryType, String packagingType) {
        parcel.setPickupAddress(request.getPickupAddress());
        parcel.setPickupContactInfo(request.getPickupContactInfo());
        parcel.setDropLocation(request.getDropLocation());
        parcel.setDropContactInfo(request.getDropContactInfo());
        parcel.setDeliveryType(deliveryType);
        parcel.setPackagingType(packagingType);
        parcel.setCost(cost);
        parcel.setPickupDate(request.getPickupDate());
        parcel.setSenderName(request.getSenderName());
        parcel.setDropZipCode(request.getDropZipCode());
        parcel.setPickupZipCode(request.getPickupZipCode());
        parcel.setReceiverName(request.getReceiverName());
        parcel.setUpdatedAt(LocalDateTime.now());
    }

    public ParcelResponse toResponse(Parcel parcel) {
        Optional<Payment> payment = paymentRepository.findByParcelId(parcel.getId());
        return ParcelResponse.builder()
                .id(parcel.getId())
                .trackingId(parcel.getTrackingId())
                .senderName(parcel.getSender().getName())
                .senderUsername(parcel.getSender().getUsername())
                .senderEmail(parcel.getSender().getEmail())
                .senderPhone(parcel.getSender().getPhone())
                .senderAddress(parcel.getSender().getAddress())
                .pickupAddress(parcel.getPickupAddress())
                .pickupZipCode(parcel.getPickupZipCode())
                .pickupContactInfo(parcel.getPickupContactInfo())
                .dropLocation(parcel.getDropLocation())
                .dropZipCode(parcel.getDropZipCode())
                .senderName(parcel.getSenderName())
                .receiverName(parcel.getReceiverName())
                .dropContactInfo(parcel.getDropContactInfo())
                .weight(parcel.getWeight())
                .deliveryType(parcel.getDeliveryType())
                .packagingType(parcel.getPackagingType())
                .cost(parcel.getCost())
                .pickupDate(parcel.getPickupDate())
                .status(parcel.getStatus().toString())
                .createdAt(parcel.getCreatedAt())
                .updatedAt(parcel.getUpdatedAt())
                .paymentStatus(payment.map(value -> value.getStatus().toString()).orElse("PAYMENT_PENDING"))
                .paymentMethod(payment.map(Payment::getMethod).map(Enum::toString).orElse(null))
                .transactionId(payment.map(Payment::getTransactionId).orElse(null))
                .build();
    }

    public TrackingResponse toTrackingResponse(Parcel parcel) {
        return TrackingResponse.builder()
                .trackingId(parcel.getTrackingId())
                .status(parcel.getStatus().toString())
                .deliveryType(parcel.getDeliveryType())
                .packagingType(parcel.getPackagingType())
                .message("Parcel is " + parcel.getStatus().toString())
                .build();
    }

    public InvoiceResponse toInvoiceResponse(Parcel parcel) {
        return InvoiceResponse.builder()
                .parcelId(parcel.getId())
                .trackingId(parcel.getTrackingId())
                .sender(parcel.getSender().getUsername())
                .pickupAddress(parcel.getPickupAddress())
                .dropLocation(parcel.getDropLocation())
                .weight(parcel.getWeight())
                .deliveryType(parcel.getDeliveryType())
                .packagingType(parcel.getPackagingType())
                .cost(parcel.getCost())
                .status(parcel.getStatus().toString())
                .createdAt(parcel.getCreatedAt().toString())
                .build();
    }
}
