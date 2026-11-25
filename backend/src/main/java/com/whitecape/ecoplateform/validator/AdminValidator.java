package com.whitecape.ecoplateform.validator;

import com.whitecape.ecoplateform.dto.Authentication.RegisterRequest;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class AdminValidator {
    public static void validate(RegisterRequest request) {
        if (request == null) {
            throw new InvalidEntityException(
                    "Les informations de l'administrateur sont manquantes. Veuillez renseigner le nom d'utilisateur, le mail, le mot de passe et la ville.",
                    ErrorCodes.USER_NOT_VALID
            );
        }

        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasLength(request.getUserName())) {
            errors.add("Le nom d'utilisateur est obligatoire.");
        }

        if (!StringUtils.hasLength(request.getMail())) {
            errors.add("L'adresse mail est obligatoire.");
        }

        if (!StringUtils.hasLength(request.getPassword())) {
            errors.add("Le mot de passe est obligatoire.");
        }

        if (!StringUtils.hasLength(request.getCity())) {
            errors.add("La ville est obligatoire.");
        }

        if (!errors.isEmpty()) {
            throw new InvalidEntityException(
                    "Erreur de validation : " + String.join(" ", errors),
                    ErrorCodes.USER_NOT_VALID
            );
        }
    }
}
