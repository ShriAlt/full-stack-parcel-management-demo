package com.tcs.parcelX.config;

import com.tcs.parcelX.entity.Parcel;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.repository.ParcelRepository;
import com.tcs.parcelX.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Configuration
public class DemoDataConfig {
    @Bean
    CommandLineRunner seedDemoData(UserRepository userRepository,
                                   ParcelRepository parcelRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername("admin")
                    .or(() -> userRepository.findByPhone("9876543210"))
                    .orElseGet(() -> userRepository.save(
                    User.builder()
                            .username("admin")
                            .password(passwordEncoder.encode("admin123"))
                            .email("admin@gmail.com")
                            .name("Admin User")
                            .phone("9876543210")
                            .address("123 Admin Street")
                            .city("Bangalore")
                            .state("Karnataka")
                            .zipCode("560010")
                            .role(User.Role.ADMIN)
                            .createdAt(LocalDateTime.now())
                            .build()));

            User user = userRepository.findByUsername("user33")
                    .or(() -> userRepository.findByPhone("9123456789"))
                    .orElseGet(() -> userRepository.save(
                    User.builder()
                            .username("user33")
                            .password(passwordEncoder.encode("user123"))
                            .email("user@gmail.com")
                            .name("user")
                            .phone("9123456789")
                            .address("456 User Avenue")
                            .city("Bangalore")
                            .state("Karnataka")
                            .zipCode("560010")
                            .role(User.Role.CUSTOMER)
                            .createdAt(LocalDateTime.now())
                            .build()));
            if (!"user33".equals(user.getUsername()) && userRepository.findByUsername("user33").isEmpty()) {
                user.setUsername("user33");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole(User.Role.CUSTOMER);
                user.setUpdatedAt(LocalDateTime.now());
                user = userRepository.save(user);
            }

            if (parcelRepository.count() == 0) {
                parcelRepository.save(
                        Parcel.builder()
                                .trackingId(
                                        "TRK-" +
                                                UUID.randomUUID()
                                                        .toString()
                                                        .substring(0, 8)
                                                        .toUpperCase()
                                )
                                .sender(user)
                                .senderName("Rahul Sharma")
                                .receiverName("Aman Verma")
                                .pickupAddress("123 Sender Street")
                                .pickupZipCode("110001")
                                .pickupContactInfo("9876543210")
                                .dropLocation("456 Receiver Road")
                                .dropZipCode("400001")
                                .dropContactInfo("9123456789")
                                .weight(2000.0)
                                .deliveryType("STANDARD")
                                .packagingType("BASIC")
                                .cost(136.5)
                                .pickupDate(LocalDate.now())
                                .status(Parcel.ParcelStatus.CREATED)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build()
                );
            }
            ;
        };
    }
}




