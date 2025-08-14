package com.travel.dao;

import com.travel.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TourDao extends JpaRepository<Tour, Long> {
    
    List<Tour> findByIsActive(Boolean isActive);
    
    List<Tour> findByCategory(Tour.Category category);
    
    List<Tour> findByDestination(String destination);
    
    List<Tour> findByDifficulty(Tour.Difficulty difficulty);
    
    List<Tour> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Tour> findByDurationBetween(Integer minDuration, Integer maxDuration);
    
    @Query("SELECT t FROM Tour t WHERE t.isActive = true AND (t.title LIKE %:searchTerm% OR t.description LIKE %:searchTerm% OR t.destination LIKE %:searchTerm%)")
    List<Tour> searchTours(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT t FROM Tour t WHERE t.isActive = true AND t.category = :category AND t.price BETWEEN :minPrice AND :maxPrice")
    List<Tour> findByCategoryAndPriceRange(@Param("category") Tour.Category category, 
                                         @Param("minPrice") BigDecimal minPrice, 
                                         @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT t FROM Tour t WHERE t.isActive = true ORDER BY t.rating DESC")
    List<Tour> findTopRatedTours();
    
    @Query("SELECT t FROM Tour t WHERE t.isActive = true ORDER BY t.createdAt DESC")
    List<Tour> findLatestTours();
} 