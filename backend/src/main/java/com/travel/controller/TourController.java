package com.travel.controller;

import com.travel.dto.TourDto;
import com.travel.entity.Tour;
import com.travel.service.TourService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TourController {
    
    private final TourService tourService;
    
    @GetMapping
    public ResponseEntity<List<TourDto>> getAllTours() {
        List<TourDto> tours = tourService.getAllActiveTours();
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TourDto> getTourById(@PathVariable Long id) {
        TourDto tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TourDto>> getToursByCategory(@PathVariable Tour.Category category) {
        List<TourDto> tours = tourService.getToursByCategory(category);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<TourDto>> getToursByDestination(@PathVariable String destination) {
        List<TourDto> tours = tourService.getToursByDestination(destination);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<TourDto>> getToursByDifficulty(@PathVariable Tour.Difficulty difficulty) {
        List<TourDto> tours = tourService.getToursByDifficulty(difficulty);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TourDto>> searchTours(@RequestParam String query) {
        List<TourDto> tours = tourService.searchTours(query);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<TourDto>> getToursByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<TourDto> tours = tourService.getToursByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/duration-range")
    public ResponseEntity<List<TourDto>> getToursByDurationRange(
            @RequestParam Integer minDuration,
            @RequestParam Integer maxDuration) {
        List<TourDto> tours = tourService.getToursByDurationRange(minDuration, maxDuration);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/top-rated")
    public ResponseEntity<List<TourDto>> getTopRatedTours() {
        List<TourDto> tours = tourService.getTopRatedTours();
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/latest")
    public ResponseEntity<List<TourDto>> getLatestTours() {
        List<TourDto> tours = tourService.getLatestTours();
        return ResponseEntity.ok(tours);
    }
    
    @PostMapping
    public ResponseEntity<TourDto> createTour(@Valid @RequestBody TourDto tourDto) {
        TourDto createdTour = tourService.createTour(tourDto);
        return ResponseEntity.ok(createdTour);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TourDto> updateTour(@PathVariable Long id, @Valid @RequestBody TourDto tourDto) {
        TourDto updatedTour = tourService.updateTour(id, tourDto);
        return ResponseEntity.ok(updatedTour);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateTour(@PathVariable Long id) {
        tourService.activateTour(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateTour(@PathVariable Long id) {
        tourService.deactivateTour(id);
        return ResponseEntity.ok().build();
    }
} 