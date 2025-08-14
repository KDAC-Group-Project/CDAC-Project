package com.travel.service.impl;

import com.travel.dao.ReviewDao;
import com.travel.dao.TourDao;
import com.travel.dto.TourDto;
import com.travel.entity.Tour;
import com.travel.exception.ResourceNotFoundException;
import com.travel.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {
    
    private final TourDao tourDao;
    private final ReviewDao reviewDao;
    
    @Override
    public TourDto createTour(TourDto tourDto) {
        Tour tour = convertToEntity(tourDto);
        Tour savedTour = tourDao.save(tour);
        return convertToDto(savedTour);
    }
    
    @Override
    public TourDto getTourById(Long id) {
        Tour tour = tourDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
        return convertToDto(tour);
    }
    
    @Override
    public List<TourDto> getAllTours() {
        return tourDao.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getAllActiveTours() {
        return tourDao.findByIsActive(true).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getToursByCategory(Tour.Category category) {
        return tourDao.findByCategory(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getToursByDestination(String destination) {
        return tourDao.findByDestination(destination).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getToursByDifficulty(Tour.Difficulty difficulty) {
        return tourDao.findByDifficulty(difficulty).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getToursByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return tourDao.findByPriceBetween(minPrice, maxPrice).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getToursByDurationRange(Integer minDuration, Integer maxDuration) {
        return tourDao.findByDurationBetween(minDuration, maxDuration).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> searchTours(String searchTerm) {
        return tourDao.searchTours(searchTerm).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getTopRatedTours() {
        return tourDao.findTopRatedTours().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TourDto> getLatestTours() {
        return tourDao.findLatestTours().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public TourDto updateTour(Long id, TourDto tourDto) {
        Tour tour = tourDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
        
        tour.setTitle(tourDto.getTitle());
        tour.setDescription(tourDto.getDescription());
        tour.setPrice(tourDto.getPrice());
        tour.setDuration(tourDto.getDuration());
        tour.setDestination(tourDto.getDestination());
        tour.setCategory(tourDto.getCategory());
        tour.setImageUrl(tourDto.getImageUrl());
        tour.setIncludes(tourDto.getIncludes());
        tour.setMaxGroupSize(tourDto.getMaxGroupSize());
        tour.setDifficulty(tourDto.getDifficulty());
        tour.setIsActive(tourDto.getIsActive());
        
        Tour updatedTour = tourDao.save(tour);
        return convertToDto(updatedTour);
    }
    
    @Override
    public void deleteTour(Long id) {
        if (!tourDao.existsById(id)) {
            throw new ResourceNotFoundException("Tour not found with id: " + id);
        }
        tourDao.deleteById(id);
    }
    
    @Override
    public void deactivateTour(Long id) {
        Tour tour = tourDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
        tour.setIsActive(false);
        tourDao.save(tour);
    }
    
    @Override
    public void activateTour(Long id) {
        Tour tour = tourDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
        tour.setIsActive(true);
        tourDao.save(tour);
    }
    
    @Override
    public void updateTourRating(Long tourId) {
        Tour tour = tourDao.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));
        
        Double averageRating = reviewDao.getAverageRatingByTourId(tourId);
        Long reviewCount = reviewDao.countReviewsByTourId(tourId);
        
        tour.setRating(averageRating != null ? averageRating : 0.0);
        tour.setReviewCount(reviewCount.intValue());
        
        tourDao.save(tour);
    }
    
    private TourDto convertToDto(Tour tour) {
        TourDto dto = new TourDto();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        dto.setDuration(tour.getDuration());
        dto.setDestination(tour.getDestination());
        dto.setCategory(tour.getCategory());
        dto.setImageUrl(tour.getImageUrl());
        dto.setTourImage(tour.getImageUrl()); // Set tourImage to match imageUrl for frontend compatibility
        dto.setIncludes(tour.getIncludes());
        dto.setMaxGroupSize(tour.getMaxGroupSize());
        dto.setDifficulty(tour.getDifficulty());
        dto.setRating(tour.getRating());
        dto.setReviewCount(tour.getReviewCount());
        dto.setIsActive(tour.getIsActive());
        dto.setCreatedAt(tour.getCreatedAt());
        return dto;
    }
    
    private Tour convertToEntity(TourDto dto) {
        Tour tour = new Tour();
        tour.setTitle(dto.getTitle());
        tour.setDescription(dto.getDescription());
        tour.setPrice(dto.getPrice());
        tour.setDuration(dto.getDuration());
        tour.setDestination(dto.getDestination());
        tour.setCategory(dto.getCategory());
        tour.setImageUrl(dto.getImageUrl());
        tour.setIncludes(dto.getIncludes());
        tour.setMaxGroupSize(dto.getMaxGroupSize());
        tour.setDifficulty(dto.getDifficulty());
        tour.setIsActive(dto.getIsActive());
        return tour;
    }
} 