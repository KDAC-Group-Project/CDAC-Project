package com.travel.service.impl;

import com.travel.dao.TourDao;
import com.travel.dao.UserDao;
import com.travel.dao.WishlistDao;
import com.travel.dto.TourDto;
import com.travel.dto.UserDto;
import com.travel.entity.Tour;
import com.travel.entity.User;
import com.travel.entity.Wishlist;
import com.travel.exception.ResourceNotFoundException;
import com.travel.service.TourService;
import com.travel.service.UserService;
import com.travel.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {
    
    private final WishlistDao wishlistDao;
    private final UserDao userDao;
    private final TourDao tourDao;
    private final UserService userService;
    private final TourService tourService;
    
    @Override
    @Transactional
    public void addToWishlist(Long userId, Long tourId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Tour tour = tourDao.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));
        
        if (wishlistDao.existsByUserIdAndTourId(userId, tourId)) {
            throw new RuntimeException("Tour is already in wishlist");
        }
        
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setTour(tour);
        
        wishlistDao.save(wishlist);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeFromWishlist(Long userId, Long tourId) {
        if (!wishlistDao.existsByUserIdAndTourId(userId, tourId)) {
            // Make removal idempotent: if it's already not present, treat as success
            return;
        }

        wishlistDao.deleteByUserIdAndTourId(userId, tourId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TourDto> getUserWishlist(Long userId) {
        return wishlistDao.findUserWishlistOrderByDate(userId).stream()
                .map(wishlist -> tourService.getTourById(wishlist.getTour().getId()))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(Long userId, Long tourId) {
        return wishlistDao.existsByUserIdAndTourId(userId, tourId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long getWishlistCountByTourId(Long tourId) {
        return wishlistDao.countWishlistByTourId(tourId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TourDto> getCurrentUserWishlist() {
        UserDto currentUser = userService.getCurrentUser();
        return getUserWishlist(currentUser.getId());
    }

    @Override
    @Transactional
    public void addToWishlistForCurrentUser(Long tourId) {
        User currentUser = userService.getCurrentUserEntity();
        addToWishlist(currentUser.getId(), tourId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeFromWishlistForCurrentUser(Long tourId) {
        User currentUser = userService.getCurrentUserEntity();
        removeFromWishlist(currentUser.getId(), tourId);
    }
}