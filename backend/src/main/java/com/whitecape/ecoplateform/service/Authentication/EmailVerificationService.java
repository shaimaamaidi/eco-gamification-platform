package com.whitecape.ecoplateform.service.Authentication;

import com.whitecape.ecoplateform.dto.Authentication.ResendRequest;
import com.whitecape.ecoplateform.dto.Authentication.VerifyRequest;
import com.whitecape.ecoplateform.entity.User;
import com.whitecape.ecoplateform.entity.authentification.EmailVerification;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.repository.UserRepository;
import com.whitecape.ecoplateform.repository.authentification.EmailVerificationRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {
    private final EmailVerificationRepository emailVerificationRepository;
    private final UserRepository userRepository;
    private final EmailSenderService emailService;

    @Transactional
    public void sendVerificationCode(User user) throws MessagingException, IOException {
        EmailVerification verification=new EmailVerification();

        int code=generateVerificationCode();
        LocalDateTime time=LocalDateTime.now().plusMinutes(15);

        verification.setVerificationCode(code);
        verification.setVerificationCodeExpiresAt(time);
        verification.setUser(user);

        EmailVerification savedVerification=emailVerificationRepository.save(verification);
        user.setEmailVerification(savedVerification);
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getMail(), code,"15 minutes");
    }
    @Transactional
    public void resendVerificationCode(ResendRequest request) throws MessagingException, IOException {
        User user = userRepository.findByMail(request.getMail()).orElseThrow(()->new InvalidEntityException(
                "L’adresse e-mail fournie n’existe pas. ", ErrorCodes.ADRESSE_MAIL_NOT_FOUND));

        if (user.isEnabled())
            throw new RuntimeException("Account is already verified");

        EmailVerification verification = emailVerificationRepository.findByUser_Mail(user.getMail())
                .orElse(new EmailVerification());

        int code=generateVerificationCode();
        LocalDateTime time=LocalDateTime.now().plusHours(1);

        verification.setVerificationCode(code);
        verification.setVerificationCodeExpiresAt(time);
        verification.setUser(user);

        EmailVerification savedVerification=emailVerificationRepository.save(verification);

        user.setEmailVerification(savedVerification);
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getMail(), code,"une heure");
    }
    @Transactional
    public void verifyUser(VerifyRequest request) {
        User user = userRepository.findByMail(request.getMail()).orElseThrow(() -> new InvalidEntityException(
                "L’adresse e-mail fournie n’existe pas. ", ErrorCodes.ADRESSE_MAIL_NOT_FOUND));

        if (user.isEnabled())
            throw new InvalidOperationException(
                    "Le compte est déjà vérifié.",ErrorCodes.ACCOUNT_ALREADY_VERIFIED);

        if (user.getEmailVerification().getVerificationCodeExpiresAt().isBefore(LocalDateTime.now()))
            throw new InvalidOperationException(
                    "Le code de vérification a expiré.", ErrorCodes.VERIFICATION_CODE_EXPIRED);

        if (user.getEmailVerification().getVerificationCode()!=request.getVerificationCode())
            throw new InvalidEntityException(
                    "Le code de vérification est invalide.", ErrorCodes.INVALID_VERIFICATION_CODE);

        EmailVerification verification=user.getEmailVerification();
        user.setEnabled(true);
        user.setEmailVerification(null);
        userRepository.save(user);

        emailVerificationRepository.delete(verification);
    }
    public void sendResetPasswordEmail(User user,String token) throws MessagingException, IOException {
        emailService.sendResetPasswordEmail(user.getMail(), token);
    }
    private int generateVerificationCode() {
        Random random = new Random();
        return random.nextInt(900000) + 100000;
    }
}
