package com.whitecape.ecoplateform.validator;

import com.whitecape.ecoplateform.dto.ChallengeDTO;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidEntityException;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import org.springframework.util.StringUtils;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

public class ChallengeValidator {

    public static void validateAdding(ChallengeDTO challengeDTO) {
        if (challengeDTO == null)
            throw new InvalidEntityException(
                    "Les informations du défi sont manquantes. Veuillez renseigner le titre, la description, l'objectif, le type d'action, la date de début et de fin, ainsi que l'icône.",
                    ErrorCodes.CHALLENGE_NOT_VALID
            );

        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasLength(challengeDTO.getTitle()))
            errors.add("Le titre du défi est obligatoire.");

        if (!StringUtils.hasLength(challengeDTO.getDescription()))
            errors.add("La description du défi est obligatoire.");

        if (challengeDTO.getGoal() <= 0)
            errors.add("Le nombre de points nécessaire pour ce défi doit être supérieur à zéro.");

        if (!isValidType(challengeDTO.getActionType()))
            errors.add("Le type d'action du défi est obligatoire.");

        if (!isValidDate(challengeDTO.getStartDate()))
            errors.add("La date de début du défi est obligatoire et doit être au format yyyy-MM-dd.");

        if (!isValidDate(challengeDTO.getEndDate()))
            errors.add("La date de fin du défi est obligatoire et doit être au format yyyy-MM-dd.");

        if (challengeDTO.getIcon() == null || challengeDTO.getIcon().isEmpty())
            errors.add("L'icône du défi est obligatoire.");

        if (!StringUtils.hasLength(challengeDTO.getExtension()))
            errors.add("L'extension de l'image du défi est obligatoire.");

        if (!errors.isEmpty())
            throw new InvalidEntityException(
                    "Erreur de validation : " + String.join(" ", errors),
                    ErrorCodes.CHALLENGE_NOT_VALID
            );
    }

    public static void validateUpdation(ChallengeDTO challengeDTO) {
        if (challengeDTO == null)
            throw new InvalidEntityException(
                    "Aucune information du défi fournie pour la mise à jour.",
                    ErrorCodes.CHALLENGE_NOT_VALID
            );
        if (!StringUtils.hasLength(challengeDTO.getDescription())
                && !isValidDate(challengeDTO.getEndDate())
                && (challengeDTO.getIcon() == null || !StringUtils.hasLength(challengeDTO.getIcon())))
            throw new InvalidEntityException(
                    "Veuillez renseigner au moins la nouvelle date de fin, la nouvelle description ou la nouvelle icône du défi.",
                    ErrorCodes.CHALLENGE_NOT_VALID
            );
    }

    private static boolean isValidDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank())
            return false;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try {
            LocalDate.parse(dateStr, formatter);
            return true;
        } catch (DateTimeParseException e) {
            throw new InvalidEntityException(
                    "La date doit être au format yyyy-MM-dd.",
                    ErrorCodes.DATE_NOT_VALID
            );
        }
    }

    private static boolean isValidType(String type) {
        if (type == null || type.isBlank())
            return false;

        switch (type.toUpperCase()) {
            case "TRI", "RECYCLAGE", "COMPOSTAGE", "PLANTATION", "NETTOYAGE" -> {
                return true;
            }
            default -> throw new InvalidOperationException(
                    "Le type d'action '" + type + "' est invalide.",
                    ErrorCodes.TYPE_NOT_VALID
            );
        }
    }
}
