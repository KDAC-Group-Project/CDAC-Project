package com.travel.controller;

import com.travel.dto.BookingDto;
import com.travel.dto.TourDto;
import com.travel.dto.UserDto;
import com.travel.entity.Booking;
import com.travel.service.BookingService;
import com.travel.service.TourService;
import com.travel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final UserService userService;
    private final TourService tourService;
    private final BookingService bookingService;
    
    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/active")
    public ResponseEntity<List<UserDto>> getActiveUsers() {
        List<UserDto> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/users/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String searchTerm) {
        List<UserDto> users = userService.searchUsers(searchTerm);
        return ResponseEntity.ok(users);
    }
    
    // Tour Management
    @GetMapping("/tours")
    public ResponseEntity<List<TourDto>> getAllTours() {
        List<TourDto> tours = tourService.getAllTours();
        return ResponseEntity.ok(tours);
    }
    
    @PostMapping("/tours")
    public ResponseEntity<TourDto> createTour(@RequestBody TourDto tourDto) {
        TourDto createdTour = tourService.createTour(tourDto);
        return ResponseEntity.ok(createdTour);
    }
    
    @PutMapping("/tours/{id}")
    public ResponseEntity<TourDto> updateTour(@PathVariable Long id, @RequestBody TourDto tourDto) {
        TourDto updatedTour = tourService.updateTour(id, tourDto);
        return ResponseEntity.ok(updatedTour);
    }
    
    @DeleteMapping("/tours/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/tours/{id}/activate")
    public ResponseEntity<Void> activateTour(@PathVariable Long id) {
        tourService.activateTour(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/tours/{id}/deactivate")
    public ResponseEntity<Void> deactivateTour(@PathVariable Long id) {
        tourService.deactivateTour(id);
        return ResponseEntity.ok().build();
    }
    
    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        List<BookingDto> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<List<BookingDto>> getBookingsByStatus(@PathVariable Booking.BookingStatus status) {
        List<BookingDto> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }
    
    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingDto> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam Booking.BookingStatus status) {
        BookingDto updatedBooking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(updatedBooking);
    }
    
    @PutMapping("/bookings/{id}/payment-status")
    public ResponseEntity<BookingDto> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam Booking.PaymentStatus paymentStatus) {
        BookingDto updatedBooking = bookingService.updatePaymentStatus(id, paymentStatus);
        return ResponseEntity.ok(updatedBooking);
    }
    
    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userService.getTotalUserCount());
        stats.put("activeUsers", userService.getActiveUserCount());
        stats.put("confirmedBookings", bookingService.getConfirmedBookingsCount());
        stats.put("totalRevenue", bookingService.getTotalRevenue());
        
        return ResponseEntity.ok(stats);
    }
} 