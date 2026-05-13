package com.tcs.parcelX.service;
import com.tcs.parcelX.dto.UserProfileResponse;
import com.tcs.parcelX.dto.UserProfileUpdateRequest;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.exception.BadRequestException;
import com.tcs.parcelX.exception.UserNotFoundException;
import com.tcs.parcelX.mapper.UserMapper;
import com.tcs.parcelX.repository.UserRepository;
import com.tcs.parcelX.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;

    public UserProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return userMapper.toProfileResponse(user);
    }

    public UserProfileResponse updateProfile(String username, UserProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (request.getEmail() != null && !ValidationUtil.isValidEmail(request.getEmail())) {
            throw new BadRequestException("Invalid email format");
        }
        if (request.getPhone() != null && !ValidationUtil.isValidPhone(request.getPhone())) {
            throw new BadRequestException("Phone must be a valid 10 digit number starting with 6, 7, 8, or 9");
        }
        if (request.getAddress() != null && !ValidationUtil.isValidAddress(request.getAddress())) {
            throw new BadRequestException("Address must be between 10 and 120 characters");
        }
        if (request.getZipCode() != null && !ValidationUtil.isValidZipCode(request.getZipCode())) {
            throw new BadRequestException("Pin code must be a valid 6 digit Indian PIN code");
        }
        if (request.getCity() != null && !ValidationUtil.isValidLocationName(request.getCity())) {
            throw new BadRequestException("City must contain only letters and spaces, between 3 and 50 characters");
        }
        if (request.getState() != null && !ValidationUtil.isValidLocationName(request.getState())) {
            throw new BadRequestException("State must contain only letters and spaces, between 3 and 50 characters");
        }
        if (request.getEmail() != null) {
            userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) {
                    throw new BadRequestException("Email is already registered");
                }
            });
        }
        if (request.getPhone() != null) {
            userRepository.findByPhone(request.getPhone()).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) {
                    throw new BadRequestException("Phone number is already registered");
                }
            });
        }
        userMapper.updateEntity(user, request);
        user.setUpdatedAt(LocalDateTime.now());
        User updated = userRepository.save(user);
        return userMapper.toProfileResponse(updated);
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toProfileResponse)
                .collect(Collectors.toList());
    }
}
