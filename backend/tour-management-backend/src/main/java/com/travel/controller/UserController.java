package com.travel.controller;

import com.travel.dto.ProfileUpdateDto;
import com.travel.dto.UserDto;
import com.travel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody ProfileUpdateDto updateDto) {
        UserDto updatedUser = userService.updateCurrentUserProfile(updateDto);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }
}