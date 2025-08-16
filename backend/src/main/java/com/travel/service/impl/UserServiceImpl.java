package com.travel.service.impl;

import com.travel.dao.UserDao;
import com.travel.dto.ProfileUpdateDto;
import com.travel.dto.UserDto;
import com.travel.dto.UserRegistrationDto;
import com.travel.entity.User;
import com.travel.exception.ResourceNotFoundException;
import com.travel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserDto registerUser(UserRegistrationDto registrationDto) {
        if (userDao.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        user.setAvatarUrl(registrationDto.getAvatarUrl());
        user.setRole(User.Role.USER);
        user.setIsActive(true);
        user.setTotalBookings(0);
        user.setTotalSpent(0.0);
        user.setReviewsGiven(0);
        
        User savedUser = userDao.save(user);
        return convertToDto(savedUser);
    }
    
    @Override
    public UserDto getUserById(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }
    
    @Override
    public UserDto getUserByEmail(String email) {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToDto(user);
    }
    
    @Override
    public List<UserDto> getAllUsers() {
        return userDao.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserDto> getAllActiveUsers() {
        return userDao.findAllActiveUsers().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setAvatarUrl(userDto.getAvatarUrl());
        
        User updatedUser = userDao.save(user);
        return convertToDto(updatedUser);
    }
    
   
    
    @Override
    public void deleteUser(Long id) {
        if (!userDao.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userDao.deleteById(id);
    }
    
    @Override
    public void deactivateUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setIsActive(false);
        userDao.save(user);
    }
    
    @Override
    public void activateUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setIsActive(true);
        userDao.save(user);
    }
    
    @Override
    public List<UserDto> searchUsers(String searchTerm) {
        return userDao.searchUsers(searchTerm).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Long getTotalUserCount() {
        return userDao.countAllUsers();
    }
    
    @Override
    public Long getActiveUserCount() {
        return userDao.countActiveUsers();
    }
    
    @Override
    public UserDto getCurrentUser() {
        User user = getCurrentUserEntity();
        return convertToDto(user);
    }
    
    @Override
    public User getCurrentUserEntity() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userDao.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
    
    @Override
    public void updateLastLogin(Long userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setLastLogin(LocalDateTime.now());
        userDao.save(user);
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setJoinDate(user.getJoinDate());
        dto.setLastLogin(user.getLastLogin());
        dto.setIsActive(user.getIsActive());
        dto.setTotalBookings(user.getTotalBookings());
        dto.setTotalSpent(user.getTotalSpent());
        dto.setCountriesVisited(user.getCountriesVisited());
        dto.setReviewsGiven(user.getReviewsGiven());
        return dto;
    }

	@Override
	public UserDto updateCurrentUserProfile(ProfileUpdateDto updateDto) {
		   User user = getCurrentUserEntity();
		    
		    // Update only non-null fields
		    Optional.ofNullable(updateDto.getFirstName()).ifPresent(user::setFirstName);
		    Optional.ofNullable(updateDto.getLastName()).ifPresent(user::setLastName);
		    Optional.ofNullable(updateDto.getPhoneNumber()).ifPresent(user::setPhoneNumber);
            Optional.ofNullable(updateDto.getAvatarUrl()).ifPresent(user::setAvatarUrl);
            Optional.ofNullable(updateDto.getAddress()).ifPresent(user::setAddress);
		    
		    User updatedUser = userDao.save(user);
		    return convertToDto(updatedUser);
	}
} 