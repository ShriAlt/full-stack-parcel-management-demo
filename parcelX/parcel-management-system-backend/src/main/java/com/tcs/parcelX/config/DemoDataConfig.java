package com.tcs.parcelX.config;

import com.tcs.parcelX.entity.Parcel;
import com.tcs.parcelX.entity.DemoCard;
import com.tcs.parcelX.entity.Payment;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.repository.DemoCardRepository;
import com.tcs.parcelX.repository.ParcelRepository;
import com.tcs.parcelX.repository.PaymentRepository;
import com.tcs.parcelX.repository.UserRepository;
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
                                   DemoCardRepository demoCardRepository,
                                   PasswordEncoder passwordEncoder, PaymentRepository paymentRepository) {
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
                Parcel demoParcel = parcelRepository.save(
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
                                .status(Parcel.ParcelStatus.IN_TRANSIT)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build()
                );
                ensureDemoParcelPaid(demoParcel, paymentRepository);
            }
            parcelRepository.findAll().stream()
                    .filter(parcel -> "Rahul Sharma".equals(parcel.getSenderName())
                            && "Aman Verma".equals(parcel.getReceiverName()))
                    .findFirst()
                    .ifPresent(parcel -> ensureDemoParcelPaid(parcel, paymentRepository));
            seedDemoCards(demoCardRepository);
        };
    }

    private void ensureDemoParcelPaid(Parcel parcel, PaymentRepository paymentRepository) {
        paymentRepository.findByParcelId(parcel.getId()).ifPresentOrElse(existing -> {
            existing.setAmount(parcel.getCost());
            existing.setMethod(Payment.PaymentMethod.UPI);
            existing.setStatus(Payment.PaymentStatus.CONFIRMED);
            if (existing.getTransactionId() == null || existing.getTransactionId().isBlank()) {
                existing.setTransactionId("DEMO-PAID-" + System.currentTimeMillis());
            }
            existing.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(existing);
        }, () -> paymentRepository.save(Payment.builder()
                .parcel(parcel)
                .amount(parcel.getCost())
                .method(Payment.PaymentMethod.UPI)
                .status(Payment.PaymentStatus.CONFIRMED)
                .transactionId("DEMO-PAID-" + System.currentTimeMillis())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()));
    }

    private void seedDemoCards(DemoCardRepository demoCardRepository) {
        DemoCard[] cards = {
                demoCard("4111111111111111", "Rahul Sharma", "12/30", "123", 5000.0),
                demoCard("4111111111111129", "Aman Verma", "11/30", "234", 7500.0),
                demoCard("4111111111111137", "Priya Mehta", "10/30", "345", 10000.0),
                demoCard("4111111111111145", "Neha Singh", "09/30", "456", 12500.0),
                demoCard("4111111111111152", "Vikram Rao", "08/30", "567", 15000.0),
                demoCard("4111111111111160", "Ananya Das", "07/30", "678", 17500.0),
                demoCard("4111111111111178", "Karan Shah", "06/30", "789", 20000.0),
                demoCard("4111111111111186", "Sneha Iyer", "05/30", "891", 22500.0),
                demoCard("4111111111111194", "Arjun Nair", "04/30", "912", 25000.0),
                demoCard("4111111111111202", "Meera Kapoor", "03/30", "135", 27500.0),
                demoCard("5555555555554444", "Rohan Gupta", "12/31", "246", 30000.0),
                demoCard("5555555555554451", "Isha Patel", "11/31", "357", 32500.0),
                demoCard("5555555555554469", "Dev Malhotra", "10/31", "468", 35000.0),
                demoCard("5555555555554477", "Tanya Bose", "09/31", "579", 37500.0),
                demoCard("5555555555554485", "Nitin Kumar", "08/31", "681", 40000.0),
                demoCard("5555555555554493", "Pooja Jain", "07/31", "792", 42500.0),
                demoCard("5555555555554501", "Sahil Khan", "06/31", "813", 45000.0),
                demoCard("5555555555554519", "Riya Sen", "05/31", "924", 47500.0),
                demoCard("5555555555554527", "Aditya Roy", "04/31", "147", 50000.0),
                demoCard("5555555555554535", "Kavya Menon", "03/31", "258", 60000.0)
        };

        for (DemoCard card : cards) {
            demoCardRepository.findByCardNumber(card.getCardNumber())
                    .ifPresentOrElse(existing -> {
                        existing.setCardholderName(card.getCardholderName());
                        existing.setExpiryDate(card.getExpiryDate());
                        existing.setCvv(card.getCvv());
                        existing.setBalance(card.getBalance());
                        existing.setActive(true);
                        demoCardRepository.save(existing);
                    }, () -> demoCardRepository.save(card));
        }
    }

    private DemoCard demoCard(String cardNumber, String cardholderName, String expiryDate, String cvv, Double balance) {
        return DemoCard.builder()
                .cardNumber(cardNumber)
                .cardholderName(cardholderName)
                .expiryDate(expiryDate)
                .cvv(cvv)
                .balance(balance)
                .active(true)
                .build();
    }
}




