package com.whitecape.ecoplateform.repository.authentification;

import com.whitecape.ecoplateform.entity.authentification.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification,Long> {
    Optional<EmailVerification> findByUser_Mail(String mail);
}
