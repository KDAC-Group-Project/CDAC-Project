package com.travel.dao;

import com.travel.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewDao extends JpaRepository<Review, Long> {
    
    List<Review> findByUserId(Long userId);
    
    List<Review> findByTourId(Long tourId);
    
    List<Review> findByRating(Integer rating);
    
    @Query("SELECT r FROM Review r WHERE r.tour.id = :tourId ORDER BY r.createdAt DESC")
    List<Review> findTourReviewsOrderByDate(@Param("tourId") Long tourId);
    
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Review> findUserReviewsOrderByDate(@Param("userId") Long userId);
    
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.tour.id = :tourId")
    Double getAverageRatingByTourId(@Param("tourId") Long tourId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.tour.id = :tourId")
    Long countReviewsByTourId(@Param("tourId") Long tourId);
    
    @Query("SELECT r FROM Review r WHERE r.tour.id = :tourId AND r.rating >= :minRating")
    List<Review> findTourReviewsByMinRating(@Param("tourId") Long tourId, @Param("minRating") Integer minRating);
} 