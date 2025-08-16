package com.travel.service.impl;

import com.travel.dao.BookingDao;
import com.travel.dao.TourDao;
import com.travel.dao.UserDao;
import com.travel.dto.BookingDto;
import com.travel.entity.Booking;
import com.travel.entity.Tour;
import com.travel.entity.User;
import com.travel.exception.ResourceNotFoundException;
import com.travel.service.BookingService;
import com.travel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    
    private final BookingDao bookingDao;
    private final UserDao userDao;
    private final TourDao tourDao;
    private final UserService userService;
    
    @Override
    public BookingDto createBooking(BookingDto bookingDto) {
        // Always use the currently authenticated user
        User user = userService.getCurrentUserEntity();
        
        Tour tour = tourDao.findById(bookingDto.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + bookingDto.getTourId()));
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setBookingDate(LocalDate.now());
        booking.setTravelDate(bookingDto.getTravelDate());
        booking.setEndDate(bookingDto.getEndDate());
        booking.setGuests(bookingDto.getGuests());
        booking.setTotalAmount(bookingDto.getTotalAmount());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
        booking.setPaymentMethod(bookingDto.getPaymentMethod());
        
        Booking savedBooking = bookingDao.save(booking);
        return convertToDto(savedBooking);
    }
    
    @Override
    public BookingDto getBookingById(Long id) {
        Booking booking = bookingDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return convertToDto(booking);
    }
    
    @Override
    public List<BookingDto> getAllBookings() {
        return bookingDao.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingDto> getUserBookings(Long userId) {
        return bookingDao.findUserBookingsOrderByDate(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingDto> getTourBookings(Long tourId) {
        return bookingDao.findTourBookingsOrderByDate(tourId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingDto> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingDao.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingDto> getBookingsByPaymentStatus(Booking.PaymentStatus paymentStatus) {
        return bookingDao.findByPaymentStatus(paymentStatus).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingDto> getBookingsByDateRange(LocalDate startDate, LocalDate endDate) {
        return bookingDao.findByTravelDateBetween(startDate, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public BookingDto updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = bookingDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        booking.setStatus(status);
        Booking updatedBooking = bookingDao.save(booking);
        return convertToDto(updatedBooking);
    }
    
    @Override
    public BookingDto updatePaymentStatus(Long id, Booking.PaymentStatus paymentStatus) {
        Booking booking = bookingDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        booking.setPaymentStatus(paymentStatus);
        Booking updatedBooking = bookingDao.save(booking);
        return convertToDto(updatedBooking);
    }
    
    @Override
    public void deleteBooking(Long id) {
        if (!bookingDao.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with id: " + id);
        }
        bookingDao.deleteById(id);
    }
    
    @Override
    public Long getConfirmedBookingsCount() {
        return bookingDao.countConfirmedBookings();
    }
    
    @Override
    public Double getTotalRevenue() {
        return bookingDao.getTotalRevenue();
    }
    
    @Override
    public List<BookingDto> getCurrentUserBookings() {
        User currentUser = userService.getCurrentUserEntity();
        return getUserBookings(currentUser.getId());
    }
    
    private BookingDto convertToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setTourId(booking.getTour().getId());
        dto.setTourTitle(booking.getTour().getTitle());
        dto.setTourImage(booking.getTour().getImageUrl());
        dto.setDestination(booking.getTour().getDestination());
        dto.setUserEmail(booking.getUser().getEmail());
        dto.setUserName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
        dto.setBookingDate(booking.getBookingDate());
        dto.setTravelDate(booking.getTravelDate());
        dto.setEndDate(booking.getEndDate());
        dto.setGuests(booking.getGuests());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
} 