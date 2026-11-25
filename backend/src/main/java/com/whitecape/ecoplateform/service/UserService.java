package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.UpdatePasswordRequest;
import com.whitecape.ecoplateform.entity.User;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import com.whitecape.ecoplateform.repository.UserRepository;
import com.whitecape.ecoplateform.validator.UpdatePasswordRequestValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public void updatePassword(UpdatePasswordRequest request){
        UpdatePasswordRequestValidator.validateUpdating(request);
        User user=userRepository.findByMail(request.getMail()).orElseThrow(()->new InvalidEntityException(
                "Pas d'utilisateur avec ce mail.",
                ErrorCodes.ADRESSE_MAIL_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }
}
