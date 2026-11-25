package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.Authentication.ResendRequest;
import com.whitecape.ecoplateform.dto.Authentication.VerifyRequest;
import com.whitecape.ecoplateform.dto.UpdatePasswordRequest;
import com.whitecape.ecoplateform.service.Authentication.AuthenticationService;
import com.whitecape.ecoplateform.service.Authentication.EmailVerificationService;
import com.whitecape.ecoplateform.service.UserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private EmailVerificationService emailVerificationService;
    @PutMapping("/update_password")
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(request);
        return ResponseEntity.ok("Mot de passe mis à jour avec succès.");
    }

    @PostMapping("/verify_mail")
    public ResponseEntity<String> verifyUser(@RequestBody VerifyRequest request) {
        emailVerificationService.verifyUser(request);
        return ResponseEntity.ok("Compte vérifié avec succès !");
    }
    @PostMapping("/resend_code")
    public ResponseEntity<String> resendVerificationCode(@RequestBody ResendRequest request) throws MessagingException, IOException {
        emailVerificationService.resendVerificationCode(request);
        return ResponseEntity.ok("Verification code sent");
    }
}
