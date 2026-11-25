package com.whitecape.ecoplateform.validator;

import com.whitecape.ecoplateform.dto.UpdatePasswordRequest;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;

public class UpdatePasswordRequestValidator {

    public static void validateUpdating(UpdatePasswordRequest request) {
        if (request == null)
            throw new InvalidEntityException(
                    "Les informations de mise à jour du mot de passe sont manquantes. Veuillez renseigner l'adresse mail, l'ancien mot de passe et le nouveau mot de passe.",
                    ErrorCodes.USER_NOT_VALID
            );

        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasLength(request.getMail()))
            errors.add("L'adresse mail est obligatoire.");


        if (!StringUtils.hasLength(request.getPassword()))
            errors.add("Le nouveau mot de passe est obligatoire.");

        if (!errors.isEmpty())
            throw new InvalidEntityException(
                    "Erreur de validation : " + String.join(" ", errors),
                    ErrorCodes.USER_NOT_VALID
            );
    }
}
