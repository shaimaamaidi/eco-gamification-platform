package com.whitecape.ecoplateform.validator;

import com.whitecape.ecoplateform.dto.RecompenseDTO;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class RecompenseValidator {

    public static void validateAdding(RecompenseDTO recompenseDTO) {
        if (recompenseDTO == null)
            throw new InvalidEntityException(
                    "Les informations de la récompense sont manquantes. Veuillez renseigner le nom, la description, les points nécessaires et l'image.",
                    ErrorCodes.RECOMPENSE_NOT_VALID
            );

        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasLength(recompenseDTO.getName()))
            errors.add("Le nom de la récompense est obligatoire.");

        if (!StringUtils.hasLength(recompenseDTO.getDescription()))
            errors.add("La description de la récompense est obligatoire.");

        if (recompenseDTO.getRequiredBadges() <= 0)
            errors.add("Les points nécessaires pour s'inscrire à cette récompense doivent être supérieurs à zéro.");

        if (recompenseDTO.getIcon() == null || recompenseDTO.getIcon().isEmpty())
            errors.add("L'image de la récompense est obligatoire.");

        if (!StringUtils.hasLength(recompenseDTO.getExtension()))
            errors.add("L'extension de l'image de la récompense est obligatoire.");

        if (!errors.isEmpty())
            throw new InvalidEntityException(
                    "Erreur de validation : " + String.join(" ", errors),
                    ErrorCodes.RECOMPENSE_NOT_VALID
            );
    }

    public static void validateUpdating(RecompenseDTO recompenseDTO) {
        if (recompenseDTO == null)
            throw new InvalidEntityException(
                    "Aucune information de récompense fournie pour la mise à jour.",
                    ErrorCodes.RECOMPENSE_NOT_VALID
            );

        if (!StringUtils.hasLength(recompenseDTO.getDescription())
                && (recompenseDTO.getIcon() == null || !StringUtils.hasLength(recompenseDTO.getIcon())))
            throw new InvalidEntityException(
                    "Veuillez renseigner au moins la nouvelle description ou la nouvelle image de la récompense.",
                    ErrorCodes.RECOMPENSE_NOT_VALID
            );
    }
}
