package com.tcs.parcelX.controller;

import com.tcs.parcelX.dto.*;
import com.tcs.parcelX.dto.*;
import com.tcs.parcelX.service.ParcelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parcels")
public class ParcelController {
    @Autowired
    private ParcelService parcelService;

    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ParcelResponse>> bookParcel(@Valid @RequestBody BookParcelRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Parcel created successfully", parcelService.bookParcel(request, authentication.getName())));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ParcelResponse>>> listParcels(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Parcels fetched successfully", parcelService.listParcelsForUser(authentication.getName())));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParcelResponse>> trackParcel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Parcel fetched successfully", parcelService.trackParcel(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @GetMapping("/track/{trackingId}")
    public ResponseEntity<ApiResponse<TrackingResponse>> trackByTrackingId(@PathVariable String trackingId) {
        return ResponseEntity.ok(ApiResponse.success("Parcel tracking fetched successfully", parcelService.trackByTrackingId(trackingId)));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ParcelResponse>> updateParcel(@PathVariable Long id, @Valid @RequestBody UpdateParcelRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Parcel updated successfully", parcelService.updateParcel(id, request, authentication.getName())));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ParcelResponse>> cancelParcel(@PathVariable Long id, @Valid @RequestBody CancelParcelRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Parcel cancelled successfully", parcelService.cancelParcel(id, request, authentication.getName())));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<ParcelResponse>>> getAllParcels() {
        return ResponseEntity.ok(ApiResponse.success("All parcels fetched successfully", parcelService.getAllParcels()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<ApiResponse<ParcelResponse>> updateParcelStatus(@PathVariable Long id, @Valid @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(ApiResponse.success("Parcel status updated successfully", parcelService.updateParcelStatus(id, request.get("status"))));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/{id}/invoice")
    public ResponseEntity<ApiResponse<InvoiceResponse>> generateInvoice(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Invoice generated successfully", parcelService.generateInvoice(id, authentication.getName())));
    }
}
