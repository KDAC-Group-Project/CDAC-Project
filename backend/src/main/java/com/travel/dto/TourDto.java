package com.travel.dto;

import com.travel.entity.Tour;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private String destination;
    private Tour.Category category;
    private String imageUrl;
    private String tourImage; // Alias for imageUrl for frontend compatibility
    private List<String> includes;
    private Integer maxGroupSize;
    private Tour.Difficulty difficulty;
    private Double rating;
    private Integer reviewCount;
    private Boolean isActive;
    private LocalDateTime createdAt;
} 