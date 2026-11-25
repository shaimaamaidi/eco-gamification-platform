package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.ChallengeDTO;
import com.whitecape.ecoplateform.entity.Challenge;
import com.whitecape.ecoplateform.enums.ActionType;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.service.ImageService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class ChallengeMapper {
    public static Challenge toEntity(ChallengeDTO challengeDTO){
        Challenge challenge=new Challenge();
        challenge.setId(challengeDTO.getId());
        challenge.setTitle(challengeDTO.getTitle());
        challenge.setDescription(challengeDTO.getDescription());
        challenge.setGoal(challengeDTO.getGoal());
        switch (challengeDTO.getActionType().toUpperCase()) {
            case "TRI" ->challenge.setAction(ActionType.TRI);
            case "RECYCLAGE" -> challenge.setAction(ActionType.RECYCLAGE);
            case "COMPOSTAGE" ->challenge.setAction(ActionType.COMPOSTAGE);
            case "PLANTATION" -> challenge.setAction(ActionType.PLANTATION);
            case "NETTOYAGE" -> challenge.setAction(ActionType.NETTOYAGE);
            default ->throw  new InvalidOperationException("Type " + challengeDTO.getActionType()+" est invalide.", ErrorCodes.TYPE_NOT_VALID);
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        if (challengeDTO.getStartDate() != null && !challengeDTO.getStartDate().isBlank()) {
            challenge.setStartDate(LocalDate.parse(challengeDTO.getStartDate(), formatter));
        }
        if (challengeDTO.getEndDate() != null && !challengeDTO.getEndDate().isBlank()) {
            challenge.setEndDate(LocalDate.parse(challengeDTO.getEndDate(), formatter));
        }
        return challenge ;
    }
    public static ChallengeDTO toDTO (Challenge challenge, double progress){
        ChallengeDTO challengeDTO=new ChallengeDTO();
        challengeDTO.setId(challenge.getId());
        challengeDTO.setTitle(challenge.getTitle());
        challengeDTO.setDescription(challenge.getDescription());
        challengeDTO.setGoal(challenge.getGoal());
        challengeDTO.setActionType(challenge.getAction().toString());
        challengeDTO.setStartDate(challenge.getStartDate().toString());
        challengeDTO.setEndDate(challenge.getEndDate().toString());
        try {
            byte[] imageBytes = Files.readAllBytes(Path.of(challenge.getIcon()));
            String base64Icon = Base64.getEncoder().encodeToString(imageBytes);
            challengeDTO.setIcon(base64Icon);
            challengeDTO.setExtension(ImageService.detectExtension(imageBytes));
        } catch (Exception e) {
            challengeDTO.setIcon(null);
        }
        challengeDTO.setProgress(progress);
        return challengeDTO;
    }
}
