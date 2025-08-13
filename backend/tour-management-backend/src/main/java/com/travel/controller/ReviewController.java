package com.travel.controller;

import com.travel.dto.ReviewDto;
import com.travel.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @GetMapping
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        List<ReviewDto> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable Long id) {
        ReviewDto review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDto>> getUserReviews(@PathVariable Long userId) {
        List<ReviewDto> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<ReviewDto>> getTourReviews(@PathVariable Long tourId) {
        List<ReviewDto> reviews = reviewService.getTourReviews(tourId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<ReviewDto>> getReviewsByRating(@PathVariable Integer rating) {
        List<ReviewDto> reviews = reviewService.getReviewsByRating(rating);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/my-reviews")
    public ResponseEntity<List<ReviewDto>> getCurrentUserReviews() {
        List<ReviewDto> reviews = reviewService.getCurrentUserReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewDto reviewDto) {
        ReviewDto createdReview = reviewService.createReview(reviewDto);
        return ResponseEntity.ok(createdReview);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable Long id, @Valid @RequestBody ReviewDto reviewDto) {
        ReviewDto updatedReview = reviewService.updateReview(id, reviewDto);
        return ResponseEntity.ok(updatedReview);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/tour/{tourId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByTourId(@PathVariable Long tourId) {
        Double averageRating = reviewService.getAverageRatingByTourId(tourId);
        return ResponseEntity.ok(averageRating);
    }
    
    @GetMapping("/tour/{tourId}/review-count")
    public ResponseEntity<Long> getReviewCountByTourId(@PathVariable Long tourId) {
        Long reviewCount = reviewService.getReviewCountByTourId(tourId);
        return ResponseEntity.ok(reviewCount);
    }
} 