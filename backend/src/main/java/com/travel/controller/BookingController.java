package com.travel.controller;

import com.travel.dto.BookingDto;
import com.travel.entity.Booking;
import com.travel.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
    
    private final BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        List<BookingDto> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        BookingDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDto>> getUserBookings(@PathVariable Long userId) {
        List<BookingDto> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<BookingDto>> getTourBookings(@PathVariable Long tourId) {
        List<BookingDto> bookings = bookingService.getTourBookings(tourId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingDto>> getBookingsByStatus(@PathVariable Booking.BookingStatus status) {
        List<BookingDto> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<BookingDto>> getBookingsByPaymentStatus(@PathVariable Booking.PaymentStatus paymentStatus) {
        List<BookingDto> bookings = bookingService.getBookingsByPaymentStatus(paymentStatus);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<BookingDto>> getBookingsByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<BookingDto> bookings = bookingService.getBookingsByDateRange(startDate, endDate);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDto>> getCurrentUserBookings() {
        List<BookingDto> bookings = bookingService.getCurrentUserBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PostMapping
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody BookingDto bookingDto) {
        BookingDto createdBooking = bookingService.createBooking(bookingDto);
        return ResponseEntity.ok(createdBooking);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingDto> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam Booking.BookingStatus status) {
        BookingDto updatedBooking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(updatedBooking);
    }
    
    @PutMapping("/{id}/payment-status")
    public ResponseEntity<BookingDto> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam Booking.PaymentStatus paymentStatus) {
        BookingDto updatedBooking = bookingService.updatePaymentStatus(id, paymentStatus);
        return ResponseEntity.ok(updatedBooking);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/confirmed-count")
    public ResponseEntity<Long> getConfirmedBookingsCount() {
        Long count = bookingService.getConfirmedBookingsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/total-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        Double revenue = bookingService.getTotalRevenue();
        return ResponseEntity.ok(revenue);
    }
} 