package com.travel.service;

import com.travel.dto.ReviewDto;

import java.util.List;

public interface ReviewService {
    
    ReviewDto createReview(ReviewDto reviewDto);
    
    ReviewDto getReviewById(Long id);
    
    List<ReviewDto> getAllReviews();
    
    List<ReviewDto> getUserReviews(Long userId);
    
    List<ReviewDto> getTourReviews(Long tourId);
    
    List<ReviewDto> getReviewsByRating(Integer rating);
    
    ReviewDto updateReview(Long id, ReviewDto reviewDto);
    
    void deleteReview(Long id);
    
    Double getAverageRatingByTourId(Long tourId);
    
    Long getReviewCountByTourId(Long tourId);
    
    List<ReviewDto> getCurrentUserReviews();
} 