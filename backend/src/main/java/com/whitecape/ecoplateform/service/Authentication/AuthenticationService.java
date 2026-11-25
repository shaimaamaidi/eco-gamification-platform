package com.whitecape.ecoplateform.service.Authentication;

import com.whitecape.ecoplateform.dto.Authentication.AuthenticationRequest;
import com.whitecape.ecoplateform.dto.Authentication.AuthenticationResponse;
import com.whitecape.ecoplateform.dto.Authentication.ForgetPasswordRequest;
import com.whitecape.ecoplateform.dto.Authentication.RegisterRequest;
import com.whitecape.ecoplateform.entity.Admin;
import com.whitecape.ecoplateform.entity.Client;
import com.whitecape.ecoplateform.enums.Role;
import com.whitecape.ecoplateform.exception.AccountNotActivatedException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.ForbiddenException;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import com.whitecape.ecoplateform.repository.UserRepository;
import com.whitecape.ecoplateform.service.AdminService;
import com.whitecape.ecoplateform.service.ClientService;
import com.whitecape.ecoplateform.service.Notification.AdminNotificationService;
import com.whitecape.ecoplateform.validator.AdminValidator;
import com.whitecape.ecoplateform.validator.ClientValidator;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpHeaders;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final ClientService clientService;
    private final AdminService adminService;
    private final JWTService jwtService;
    private final EmailVerificationService emailVerificationService;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;
    private final AdminNotificationService adminNotificationService;

    @Transactional
    public AuthenticationResponse registreClient(RegisterRequest request) throws MessagingException, IOException {
        ClientValidator.validateAdding(request);

        Client client= new Client();
        client.setDisplayName(request.getUserName());
        client.setMail(request.getMail());
        client.setCity(request.getCity().toUpperCase());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setEnabled(false);
        client.setRole(Role.CLIENT);
        Client savedClient=clientService.addClient(client);

        adminNotificationService.notifyAdmin(String.format("Un nouveau client a été inscrit avec l'email %s.",savedClient.getMail()));

        var jwtToken=jwtService.generateToken(savedClient);
        var refreshToken=jwtService.generateRefreshToken(savedClient);
        tokenService.saveUserToken(savedClient,jwtToken);

        emailVerificationService.sendVerificationCode(savedClient);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
    @Transactional
    public AuthenticationResponse registreAdmin(RegisterRequest request) {
        AdminValidator.validate(request);

        Admin admin= new Admin();
        admin.setDisplayName(request.getUserName());
        admin.setMail(request.getMail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setEnabled(true);
        admin.setRole(Role.ADMIN);
        Admin savedAdmin=adminService.addAdmin(admin);

        var jwtToken=jwtService.generateToken(savedAdmin);
        var refreshToken=jwtService.generateRefreshToken(savedAdmin);
        tokenService.saveUserToken(savedAdmin,jwtToken);


        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest authRequest){
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getMail(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new ForbiddenException("Le mot de passe est incorrect.");
        }
        var user =userRepository.findByMail(authRequest.getMail()).orElseThrow(()->new InvalidEntityException(
                "L’adresse e-mail fournie n’existe pas.",
                ErrorCodes.ADRESSE_MAIL_NOT_FOUND));

        if (!user.isEnabled()) {
            throw new AccountNotActivatedException("Le compte n'est pas activé : Veuillez l'identifier tout d'abord.");

        }else {
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            tokenService.revokeAllUserTokens(user);
            tokenService.saveUserToken(user, jwtToken);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
        }
    }
    @Transactional
    public AuthenticationResponse refreshToken(HttpServletRequest request){
        final String authHeader=request.getHeader(HttpHeaders.AUTHORIZATION);
        if(authHeader==null || !authHeader.startsWith("Bearer "))
            throw new BadCredentialsException("En-tête d'autorisation manquant ou mal formé.");

        final String refreshToken=authHeader.substring(7);
        final String userMail=jwtService.extractUserName(refreshToken);

        if (userMail == null)
                throw new BadCredentialsException("Le token semble incorrecte.");

        var user = userRepository.findByMail(userMail)
                .orElseThrow(() -> new InvalidEntityException(
                        "Pad d'utilisateur avec cette adresse mail : "+userMail+".",
                        ErrorCodes.ADRESSE_MAIL_NOT_FOUND));

        if (!jwtService.isValidToken(refreshToken, user) || !jwtService.isRefreshToken(refreshToken))
            throw new BadCredentialsException("Token JWT est invalide ou corrompu.");

        var accessToken=jwtService.generateToken(user);
        var newRefreshToken= jwtService.generateRefreshToken(user);
        tokenService.revokeAllUserTokens(user);
        tokenService.saveUserToken(user,accessToken);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
    @Transactional
    public void logOut(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return;

        String jwt = authHeader.substring(7);
        var storedToken = tokenService.getByToken(jwt);
        if (storedToken != null) {
            tokenService.revokeAllUserTokens(storedToken.getUser());
            SecurityContextHolder.clearContext();
        }
    }
    @Transactional
    public void sendResetPasswordMail(ForgetPasswordRequest request) throws MessagingException, IOException {
        if(request.getMail()==null || request.getMail().isEmpty())
            throw new InvalidEntityException("Veuillez renseigner votre adresse mail.",ErrorCodes.USER_NOT_VALID);

        var user =userRepository.findByMail(request.getMail()).orElseThrow(()->new InvalidEntityException(
                "L’adresse e-mail fournie n’existe pas.",
                ErrorCodes.ADRESSE_MAIL_NOT_FOUND));

        var jwtToken = jwtService.generateToken(user);
        tokenService.revokeAllUserTokens(user);
        tokenService.saveUserToken(user, jwtToken);
        emailVerificationService.sendResetPasswordEmail(user,jwtToken);
    }
}
