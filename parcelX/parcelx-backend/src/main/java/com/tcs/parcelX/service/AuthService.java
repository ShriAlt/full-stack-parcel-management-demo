package com.tcs.parcelX.service;
import com.tcs.parcelX.dto.AuthRequest;
import com.tcs.parcelX.dto.RegisterRequest;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.exception.BadRequestException;
import com.tcs.parcelX.mapper.UserMapper;
import com.tcs.parcelX.repository.UserRepository;
import com.tcs.parcelX.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserMapper userMapper;

    public void registerUser(RegisterRequest request) {
        if (!ValidationUtil.isValidUsername(request.getUsername())) {
            throw new BadRequestException("Username must be 3-20 characters (alphanumeric and underscore only)");
        }
        if (!ValidationUtil.isValidPassword(request.getPassword())) {
            throw new BadRequestException("Password must be at least 8 characters with uppercase, lowercase, and special character");
        }
        if (!ValidationUtil.isValidName(request.getName())) {
            throw new BadRequestException("Full name must contain only letters and spaces, between 2 and 50 characters");
        }
        if (request.getEmail() != null && !ValidationUtil.isValidEmail(request.getEmail())) {
            throw new BadRequestException("Invalid email format");
        }
        if (request.getPhone() != null && !ValidationUtil.isValidPhone(request.getPhone())) {
            throw new BadRequestException("Phone must be a valid 10 digit number starting with 6, 7, 8, or 9");
        }
        if (!ValidationUtil.isValidAddress(request.getAddress())) {
            throw new BadRequestException("Address must be between 10 and 120 characters");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username is already taken");
        }
        if (request.getEmail() != null && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email is already registered");
        }
        if (request.getPhone() != null && userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new BadRequestException("Phone number is already registered");
        }

        User.Role role = User.Role.CUSTOMER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = User.Role.valueOf(request.getRole());
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Role must be ADMIN or CUSTOMER");
            }
        }

        User user = userMapper.toEntity(request, passwordEncoder.encode(request.getPassword()), role);
        userRepository.save(user);
    }

    public User validateLogin(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        return user;
    }
}

