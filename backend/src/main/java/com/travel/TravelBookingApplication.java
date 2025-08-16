package com.travel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.travel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import com.travel.dao.UserDao;

@SpringBootApplication
@EnableTransactionManagement
public class TravelBookingApplication {
    public static void main(String[] args) {
        SpringApplication.run(TravelBookingApplication.class, args);
    }

    @Autowired
    private UserDao userDao;

    @Bean
    public CommandLineRunner createAdminUser(UserService userService) {
        return args -> {
            String adminEmail = "admin@travel.com";
            try {
                userService.getUserByEmail(adminEmail);
            } catch (Exception e) {
                // User does not exist, create admin
                com.travel.dto.UserRegistrationDto adminDto = new com.travel.dto.UserRegistrationDto();
                adminDto.setFirstName("Admin");
                adminDto.setLastName("User");
                adminDto.setEmail(adminEmail);
                adminDto.setPassword("admin123");
                adminDto.setPhoneNumber("9999999999");
                adminDto.setAvatarUrl(null);
                userService.registerUser(adminDto);
                // Set role to ADMIN
                com.travel.entity.User admin = userDao.findByEmail(adminEmail).orElse(null);
                if (admin != null) {
                    admin.setRole(com.travel.entity.User.Role.ADMIN);
                    userDao.save(admin);
                }
            }
        };
    }
}
