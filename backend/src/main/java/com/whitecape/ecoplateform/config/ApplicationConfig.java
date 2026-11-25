package com.whitecape.ecoplateform.config;

import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRepository userRepository;
    @Bean
    public UserDetailsService userDetailsService(){
        return username -> userRepository.findByMail(username)
                .orElseThrow(()->new EntityNotFoundException(
                        "Aucun utilisateur avec l'adresse mail = " + username+" .",
                        ErrorCodes.ADRESSE_MAIL_NOT_FOUND
                ));
    }
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider=new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passworderEncoder());
        return authProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passworderEncoder() {
        return new BCryptPasswordEncoder();
    }

}
