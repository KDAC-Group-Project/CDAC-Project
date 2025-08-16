package com.travel.service;

import com.travel.dto.ProfileUpdateDto;
import com.travel.dto.UserDto;
import com.travel.dto.UserRegistrationDto;
import com.travel.entity.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    
    UserDto registerUser(UserRegistrationDto registrationDto);
    
    UserDto getUserById(Long id);
    
    UserDto getUserByEmail(String email);
    
    List<UserDto> getAllUsers();
    
    List<UserDto> getAllActiveUsers();
    
    UserDto updateUser(Long id, UserDto userDto);
    
    UserDto updateCurrentUserProfile(ProfileUpdateDto updateDto);
    
    void deleteUser(Long id);
    
    void deactivateUser(Long id);
    
    void activateUser(Long id);
    
    List<UserDto> searchUsers(String searchTerm);
    
    Long getTotalUserCount();
    
    Long getActiveUserCount();
    
    UserDto getCurrentUser();
    
    User getCurrentUserEntity();
    
    

    void updateLastLogin(Long userId);
} 