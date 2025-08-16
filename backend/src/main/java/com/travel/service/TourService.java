package com.travel.service;

import com.travel.dto.TourDto;
import com.travel.entity.Tour;

import java.math.BigDecimal;
import java.util.List;

public interface TourService {
    
    TourDto createTour(TourDto tourDto);
    
    TourDto getTourById(Long id);
    
    List<TourDto> getAllTours();
    
    List<TourDto> getAllActiveTours();
    
    List<TourDto> getToursByCategory(Tour.Category category);
    
    List<TourDto> getToursByDestination(String destination);
    
    List<TourDto> getToursByDifficulty(Tour.Difficulty difficulty);
    
    List<TourDto> getToursByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<TourDto> getToursByDurationRange(Integer minDuration, Integer maxDuration);
    
    List<TourDto> searchTours(String searchTerm);
    
    List<TourDto> getTopRatedTours();
    
    List<TourDto> getLatestTours();
    
    TourDto updateTour(Long id, TourDto tourDto);
    
    void deleteTour(Long id);
    
    void deactivateTour(Long id);
    
    void activateTour(Long id);
    
    void updateTourRating(Long tourId);
} 