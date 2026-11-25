package com.whitecape.ecoplateform.service.Authentication;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String mail, int code,String time) throws MessagingException, IOException {
        String htmlContent = loadHtmlTemplate("templates/verification-email.html");
        htmlContent = htmlContent.replace("{{CODE}}", Integer.toString(code));
        htmlContent = htmlContent.replace("{{TIME}}", time);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(mail);
        helper.setSubject("Code de vérification");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
    public void sendResetPasswordEmail(String email, String token) throws MessagingException, IOException {
        String htmlContent = loadHtmlTemplate("templates/reset-password-mail.html"); // charge le template
        String resetLink = "http://localhost:4200/reset_password?token=" + token + "&forgetPassword=true";
        String expirationTime = "30 minutes";

        // Remplace les balises dans le template
        htmlContent = htmlContent.replace("{{RESET_LINK}}", resetLink);
        htmlContent = htmlContent.replace("{{TIME}}", expirationTime);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Réinitialisation de votre mot de passe");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private String loadHtmlTemplate(String path) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        try (var inputStream = resource.getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

}
