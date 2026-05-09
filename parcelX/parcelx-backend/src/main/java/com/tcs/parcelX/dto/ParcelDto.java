package com.tcs.parcelX.dto;
import lombok.Data;
@Data
public class ParcelDto {
    private Long id;
    private String receiver;
    private String status;
    private Double cost;
}
