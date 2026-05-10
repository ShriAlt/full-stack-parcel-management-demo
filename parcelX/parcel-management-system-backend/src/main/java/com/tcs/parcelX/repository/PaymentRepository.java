package com.tcs.parcelX.repository;
import com.tcs.parcelX.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	Optional<Payment> findByParcelId(Long parcelId);
}
