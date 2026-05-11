package com.tcs.parcelX.repository;

import com.tcs.parcelX.entity.DemoCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DemoCardRepository extends JpaRepository<DemoCard, Long> {
    Optional<DemoCard> findByCardNumber(String cardNumber);
}
