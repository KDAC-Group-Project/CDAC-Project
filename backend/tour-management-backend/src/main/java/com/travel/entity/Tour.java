package com.travel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tours")
@Data
@NoArgsConstructor
public class Tour {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer duration; // in days
    
    @Column(nullable = false)
    private String destination;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ElementCollection
    @CollectionTable(name = "tour_includes", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "inclusion")
    private List<String> includes;
    
    @Column(name = "max_group_size")
    private Integer maxGroupSize;
    
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    @Column(precision = 2)
    private Double rating = 0.0;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Wishlist> wishlistItems;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum Category {
        BEACH, ADVENTURE, CULTURAL, WILDLIFE, CITY, MOUNTAIN, CRUISE, FOOD
    }
    
    public enum Difficulty {
        EASY, MODERATE, DIFFICULT
    }
}