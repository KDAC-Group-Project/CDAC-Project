package com.travel.dto;

import com.travel.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private User.Role role;
    private String avatarUrl;
    private LocalDateTime joinDate;
    private LocalDateTime lastLogin;
    private Boolean isActive;
    private Integer totalBookings;
    private Double totalSpent;
    private List<String> countriesVisited;
    private Integer reviewsGiven;
} 