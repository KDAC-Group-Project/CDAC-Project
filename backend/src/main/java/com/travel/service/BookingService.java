package com.travel.service;

import com.travel.dto.BookingDto;
import com.travel.entity.Booking;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {
    
    BookingDto createBooking(BookingDto bookingDto);
    
    BookingDto getBookingById(Long id);
    
    List<BookingDto> getAllBookings();
    
    List<BookingDto> getUserBookings(Long userId);
    
    List<BookingDto> getTourBookings(Long tourId);
    
    List<BookingDto> getBookingsByStatus(Booking.BookingStatus status);
    
    List<BookingDto> getBookingsByPaymentStatus(Booking.PaymentStatus paymentStatus);
    
    List<BookingDto> getBookingsByDateRange(LocalDate startDate, LocalDate endDate);
    
    BookingDto updateBookingStatus(Long id, Booking.BookingStatus status);
    
    BookingDto updatePaymentStatus(Long id, Booking.PaymentStatus paymentStatus);
    
    void deleteBooking(Long id);
    
    Long getConfirmedBookingsCount();
    
    Double getTotalRevenue();
    
    List<BookingDto> getCurrentUserBookings();
} 