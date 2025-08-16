package com.travel.controller;

import com.travel.dto.TourDto;
import com.travel.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {
    
    private final WishlistService wishlistService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TourDto>> getUserWishlist(@PathVariable Long userId) {
        List<TourDto> wishlist = wishlistService.getUserWishlist(userId);
        return ResponseEntity.ok(wishlist);
    }
    
    @GetMapping("/my-wishlist")
    public ResponseEntity<List<TourDto>> getCurrentUserWishlist() {
        List<TourDto> wishlist = wishlistService.getCurrentUserWishlist();
        return ResponseEntity.ok(wishlist);
    }
    
    @PostMapping("/add-current")
    @Transactional
    public ResponseEntity<Void> addToWishlistForCurrent(@RequestParam Long tourId) {
        wishlistService.addToWishlistForCurrentUser(tourId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove-current")
    @Transactional
    public ResponseEntity<Map<String, Object>> removeFromWishlistForCurrent(@RequestParam Long tourId) {
        wishlistService.removeFromWishlistForCurrentUser(tourId);
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("tourId", tourId);
        body.put("message", "Removed from wishlist");
        return ResponseEntity.ok(body);
    }
    
    @GetMapping("/tour/{tourId}/count")
    public ResponseEntity<Long> getWishlistCountByTourId(@PathVariable Long tourId) {
        Long count = wishlistService.getWishlistCountByTourId(tourId);
        return ResponseEntity.ok(count);
    }
} 