package com.travel.service.impl;

import com.travel.dao.ReviewDao;
import com.travel.dao.TourDao;
import com.travel.dao.UserDao;
import com.travel.dto.ReviewDto;
import com.travel.entity.Review;
import com.travel.entity.Tour;
import com.travel.entity.User;
import com.travel.exception.ResourceNotFoundException;
import com.travel.service.ReviewService;
import com.travel.service.TourService;
import com.travel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewDao reviewDao;
    private final UserDao userDao;
    private final TourDao tourDao;
    private final UserService userService;
    private final TourService tourService;
    
    @Override
    public ReviewDto createReview(ReviewDto reviewDto) {
        User user = userService.getCurrentUserEntity();
        Tour tour = tourDao.findById(reviewDto.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + reviewDto.getTourId()));
        
        Review review = new Review();
        review.setUser(user);
        review.setTour(tour);
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        
        Review savedReview = reviewDao.save(review);
        
        // Update tour rating
        tourService.updateTourRating(tour.getId());
        
        return convertToDto(savedReview);
    }
    
    @Override
    public ReviewDto getReviewById(Long id) {
        Review review = reviewDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        return convertToDto(review);
    }
    
    @Override
    public List<ReviewDto> getAllReviews() {
        return reviewDao.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ReviewDto> getUserReviews(Long userId) {
        return reviewDao.findUserReviewsOrderByDate(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ReviewDto> getTourReviews(Long tourId) {
        return reviewDao.findTourReviewsOrderByDate(tourId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ReviewDto> getReviewsByRating(Integer rating) {
        return reviewDao.findByRating(rating).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public ReviewDto updateReview(Long id, ReviewDto reviewDto) {
        Review review = reviewDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        
        Review updatedReview = reviewDao.save(review);
        
        // Update tour rating
        tourService.updateTourRating(review.getTour().getId());
        
        return convertToDto(updatedReview);
    }
    
    @Override
    public void deleteReview(Long id) {
        Review review = reviewDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        Long tourId = review.getTour().getId();
        reviewDao.deleteById(id);
        
        // Update tour rating
        tourService.updateTourRating(tourId);
    }
    
    @Override
    public Double getAverageRatingByTourId(Long tourId) {
        return reviewDao.getAverageRatingByTourId(tourId);
    }
    
    @Override
    public Long getReviewCountByTourId(Long tourId) {
        return reviewDao.countReviewsByTourId(tourId);
    }
    
    @Override
    public List<ReviewDto> getCurrentUserReviews() {
        User currentUser = userService.getCurrentUserEntity();
        return getUserReviews(currentUser.getId());
    }
    
    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setUserId(review.getUser().getId());
        dto.setTourId(review.getTour().getId());
        dto.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        dto.setUserAvatar(review.getUser().getAvatarUrl());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        // Populate tour fields for frontend display
        dto.setTourTitle(review.getTour().getTitle());
        dto.setTourDestination(review.getTour().getDestination());
        dto.setTourImage(review.getTour().getImageUrl());
        return dto;
    }
} 