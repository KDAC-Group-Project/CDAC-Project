package com.travel.dto;

import com.travel.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private Long id;
    private Long userId;
    private Long tourId;
    private String tourTitle;
    private String tourImage;
    private String destination;
    private String userEmail;
    private String userName;
    private LocalDate bookingDate;
    private LocalDate travelDate;
    private LocalDate endDate;
    private Integer guests;
    private BigDecimal totalAmount;
    private Booking.BookingStatus status;
    private Booking.PaymentStatus paymentStatus;
    private String paymentMethod;
    private LocalDateTime createdAt;
} 