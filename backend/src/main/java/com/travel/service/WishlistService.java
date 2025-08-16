package com.travel.service;

import com.travel.dto.TourDto;

import java.util.List;

public interface WishlistService {
    
    void addToWishlist(Long userId, Long tourId);
    
    void removeFromWishlist(Long userId, Long tourId);
    
    List<TourDto> getUserWishlist(Long userId);
    
    boolean isInWishlist(Long userId, Long tourId);
    
    Long getWishlistCountByTourId(Long tourId);
    
    List<TourDto> getCurrentUserWishlist();

    // New convenience methods using the current authenticated user
    void addToWishlistForCurrentUser(Long tourId);

    void removeFromWishlistForCurrentUser(Long tourId);
} 