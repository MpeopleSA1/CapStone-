package com.booking.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingDTO {
    private Long id;
    private String customerName;
    private LocalDate date;
    private Integer seats;
    private String status;
    private String notes;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}