package com.tcs.parcelX.service;
import com.tcs.parcelX.dto.AuthRequest;
import com.tcs.parcelX.dto.ForgotPasswordRequest;
import com.tcs.parcelX.dto.RegisterRequest;
import com.tcs.parcelX.dto.ResetPasswordRequest;
import com.tcs.parcelX.dto.VerifyResetOtpRequest;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.exception.BadRequestException;
import com.tcs.parcelX.mapper.UserMapper;
import com.tcs.parcelX.repository.UserRepository;
import com.tcs.parcelX.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthService {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int OTP_EXPIRY_MINUTES = 10;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private MailService mailService;

    public User registerUser(RegisterRequest request) {
        if (!ValidationUtil.isValidUsername(request.getUsername())) {
            throw new BadRequestException("Username must be 3-20 characters (alphanumeric and underscore only)");
        }
        if (!ValidationUtil.isValidPassword(request.getPassword())) {
            throw new BadRequestException("Password must be at least 8 characters with uppercase, lowercase, and special character");
        }
        if (!ValidationUtil.isValidName(request.getName())) {
            throw new BadRequestException("Full name must contain only letters and spaces, between 2 and 50 characters");
        }
        if (!ValidationUtil.isValidEmail(request.getEmail())) {
            throw new BadRequestException("Email must be a valid address and cannot start with only digits");
        }
        if (!ValidationUtil.isValidPhone(request.getPhone())) {
            throw new BadRequestException("Phone must be a valid 10 digit number starting with 6, 7, 8, or 9");
        }
        if (!ValidationUtil.isValidAddress(request.getAddress())) {
            throw new BadRequestException("Address must be between 10 and 120 characters");
        }
        if (!ValidationUtil.isValidLocationName(request.getCity())) {
            throw new BadRequestException("City must contain only letters and spaces, between 3 and 50 characters");
        }
        if (!ValidationUtil.isValidLocationName(request.getState())) {
            throw new BadRequestException("State must contain only letters and spaces, between 3 and 50 characters");
        }
        if (!ValidationUtil.isValidZipCode(request.getZipCode())) {
            throw new BadRequestException("Pin code must be a valid 6 digit Indian PIN code");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.findByEmailIgnoreCase(request.getEmail().trim()).isPresent()) {
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
        return userRepository.save(user);
    }

    public User validateLogin(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        return user;
    }

    @Transactional
    public void sendPasswordResetOtp(ForgotPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("No account is registered with this email"));

        String otp = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        user.setResetOtpHash(passwordEncoder.encode(otp));
        user.setResetOtpExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        userRepository.save(user);

        try {
            mailService.sendPasswordResetOtp(email, otp);
        } catch (BadRequestException ex) {
            user.setResetOtpHash(null);
            user.setResetOtpExpiresAt(null);
            userRepository.save(user);
            throw ex;
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = validateResetOtp(email, normalizeOtp(request.getOtp()));

        if (!ValidationUtil.isValidPassword(request.getNewPassword())) {
            throw new BadRequestException("Password must be at least 8 characters with uppercase, lowercase, and special character");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        clearResetOtp(user);
        userRepository.save(user);
    }

    public void verifyResetOtp(VerifyResetOtpRequest request) {
        validateResetOtp(normalizeEmail(request.getEmail()), normalizeOtp(request.getOtp()));
    }

    private User validateResetOtp(String email, String otp) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or OTP"));

        if (user.getResetOtpHash() == null || user.getResetOtpExpiresAt() == null) {
            throw new BadRequestException("Please request a new OTP before resetting password");
        }
        if (LocalDateTime.now().isAfter(user.getResetOtpExpiresAt())) {
            clearResetOtp(user);
            userRepository.save(user);
            throw new BadRequestException("OTP has expired. Please request a new OTP");
        }
        if (!passwordEncoder.matches(otp, user.getResetOtpHash())) {
            throw new BadRequestException("Invalid email or OTP");
        }

        return user;
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String normalizeOtp(String otp) {
        return otp == null ? "" : otp.trim();
    }

    private void clearResetOtp(User user) {
        user.setResetOtpHash(null);
        user.setResetOtpExpiresAt(null);
    }
}
