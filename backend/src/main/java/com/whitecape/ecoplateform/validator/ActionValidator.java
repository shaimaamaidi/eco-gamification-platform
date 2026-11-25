package com.whitecape.ecoplateform.validator;

import com.whitecape.ecoplateform.dto.ActionDTO;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ActionValidator {
    public static void validate(ActionDTO actionDTO) {
        if (actionDTO == null) {
            throw new InvalidEntityException(
                    "L'action ne peut pas être vide. Veuillez fournir un type et une image.",
                    ErrorCodes.ACTION_NOT_VALID
            );
        }

        List<String> errors = new ArrayList<>();

        if (actionDTO.getType() == null || actionDTO.getType().isBlank()) {
            errors.add("Le type de l'action est obligatoire.");
        }

        if (actionDTO.getImage() == null || actionDTO.getImage().isEmpty()) {
            errors.add("L'image de l'action est obligatoire.");
        }

        if (actionDTO.getExtension() == null || actionDTO.getExtension().isBlank()) {
            errors.add("L'extension de l'image est obligatoire.");
        }

        if (!errors.isEmpty()) {
            throw new InvalidEntityException(
                    "Erreur de validation : " + String.join(" ", errors),
                    ErrorCodes.ACTION_NOT_VALID
            );
        }
    }
    public static void validateRefusing(ActionDTO actionDTO) {
        if (actionDTO == null) {
            throw new InvalidEntityException(
                    "Aucune action fournie pour le refus. Veuillez sélectionner une action existante.",
                    ErrorCodes.ACTION_NOT_VALID
            );
        }

        if (!StringUtils.hasLength(actionDTO.getFeedback())) {
            throw new InvalidEntityException(
                    "La raison du refus de l'action est obligatoire.",
                    ErrorCodes.ACTION_NOT_VALID
            );
        }
    }
}
