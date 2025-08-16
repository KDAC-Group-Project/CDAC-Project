package com.travel.dto;

import lombok.Data;

@Data
public class ProfileUpdateDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;  // Changed from 'phone' to match your API payload
    private String avatarUrl;    // Changed from 'avatar' to match your API payload
    private String address;
}