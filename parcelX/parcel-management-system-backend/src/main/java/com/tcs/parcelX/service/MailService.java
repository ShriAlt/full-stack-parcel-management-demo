package com.tcs.parcelX.service;

import com.tcs.parcelX.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Value("${parcel.app.name:ParcelX}")
    private String appName;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetOtp(String toAddress, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toAddress);
        message.setSubject(appName + " password reset OTP");
        message.setText("""
                Your password reset OTP is %s.

                This OTP is valid for 10 minutes. If you did not request a password reset, you can ignore this email.
                """.formatted(otp));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new BadRequestException("Unable to send OTP email. Please check mail configuration and try again.");
        }
    }
}
