package com.travel.dao;

import com.travel.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingDao extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByTourId(Long tourId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    List<Booking> findByPaymentStatus(Booking.PaymentStatus paymentStatus);
    
    List<Booking> findByTravelDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findUserBookingsOrderByDate(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.tour.id = :tourId ORDER BY b.createdAt DESC")
    List<Booking> findTourBookingsOrderByDate(@Param("tourId") Long tourId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED'")
    Long countConfirmedBookings();
    
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.paymentStatus = 'PAID'")
    Double getTotalRevenue();
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = :status")
    List<Booking> findUserBookingsByStatus(@Param("userId") Long userId, @Param("status") Booking.BookingStatus status);
} 