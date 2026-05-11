package com.tcs.parcelX.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(unique = true)
    private String email;
    @Column
    private String name;
    @Column(unique = true)
    private String phone;
    @Column
    private String address;
    @Column
    private String city;
    @Column
    private String state;
    @Column
    private String zipCode;
    @Column
    private String resetOtpHash;
    @Column
    private LocalDateTime resetOtpExpiresAt;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @Column
    private LocalDateTime updatedAt;
    public enum Role {
        ADMIN, CUSTOMER
    }
}
