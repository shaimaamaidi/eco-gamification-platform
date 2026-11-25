package com.whitecape.ecoplateform.validator;

import com.whitecape.ecoplateform.dto.BadgeDTO;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;

public class BadgeValidator {

    public static void validateAdding(BadgeDTO badgeDTO) {
        if (badgeDTO == null)
            throw new InvalidEntityException(
                    "Les informations du badge sont manquantes. Veuillez renseigner le titre, la description, l'objectif et l'image du badge.",
                    ErrorCodes.BADGE_NOT_VALID
            );

        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasLength(badgeDTO.getTitle()))
            errors.add("Le titre du badge est obligatoire.");

        if (!StringUtils.hasLength(badgeDTO.getDescription()))
            errors.add("La description du badge est obligatoire.");

        if (badgeDTO.getGoal() < 0)
            errors.add("Le nombre d'actions nécessaires pour ce badge doit être supérieur ou égal à zéro.");

        if (badgeDTO.getIcon() == null || badgeDTO.getIcon().isEmpty())
            errors.add("L'image du badge est obligatoire.");

        if (!StringUtils.hasLength(badgeDTO.getExtension()))
            errors.add("L'extension de l'image du badge est obligatoire.");

        if (!errors.isEmpty())
            throw new InvalidEntityException(
                    "Erreur de validation : " + String.join(" ", errors),
                    ErrorCodes.BADGE_NOT_VALID
            );
    }

    public static void validateUpdation(BadgeDTO badgeDTO) {
        if (badgeDTO == null)
            throw new InvalidEntityException(
                    "Aucune information de badge fournie pour la mise à jour.",
                    ErrorCodes.BADGE_NOT_VALID
            );

        if (!StringUtils.hasLength(badgeDTO.getDescription()) && (badgeDTO.getIcon() == null || !StringUtils.hasLength(badgeDTO.getIcon())))
            throw new InvalidEntityException(
                    "Veuillez renseigner au moins la nouvelle description du badge ou la nouvelle image.",
                    ErrorCodes.BADGE_NOT_VALID
            );
    }
}
