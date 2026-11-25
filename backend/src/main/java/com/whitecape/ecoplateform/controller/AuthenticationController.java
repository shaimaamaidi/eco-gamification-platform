package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.Authentication.*;
import com.whitecape.ecoplateform.service.Authentication.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/clients/register")
    public ResponseEntity<AuthenticationResponse> registreClient(@RequestBody RegisterRequest request) throws MessagingException, IOException {
        return ResponseEntity.ok(authenticationService.registreClient(request));
    }
    @PostMapping("/admin/register")
    public ResponseEntity<AuthenticationResponse> registreAdmin(@RequestBody RegisterRequest request) throws MessagingException, IOException {
        return ResponseEntity.ok(authenticationService.registreAdmin(request));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
    @PostMapping("/refresh_token")
    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request));
    }
    @PostMapping("/reset_password")
    public ResponseEntity<String> resetPassword(@RequestBody ForgetPasswordRequest request) throws MessagingException, IOException {
        authenticationService.sendResetPasswordMail(request);
        return ResponseEntity.ok("Le mail de réinitialisation du mot de passe a été envoyé avec succès.");
    }
}
