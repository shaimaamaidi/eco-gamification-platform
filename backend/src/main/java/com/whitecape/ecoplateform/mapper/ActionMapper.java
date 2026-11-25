package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.ActionDTO;
import com.whitecape.ecoplateform.entity.Action;
import com.whitecape.ecoplateform.enums.ActionStatus;
import com.whitecape.ecoplateform.enums.ActionType;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.service.ImageService;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

public class ActionMapper {
    public static Action toEntity(ActionDTO actionDTO){
        Action action =new Action();
        String type =actionDTO.getType();
        String status= actionDTO.getStatus();
        if (type != null && !type.isBlank()) {
            switch (type.toUpperCase()) {
                case "TRI" ->action.setType(ActionType.TRI);
                case "RECYCLAGE" -> action.setType(ActionType.RECYCLAGE);
                case "COMPOSTAGE" ->action.setType(ActionType.COMPOSTAGE);
                case "PLANTATION" -> action.setType(ActionType.PLANTATION);
                case "NETTOYAGE" -> action.setType(ActionType.NETTOYAGE);
                default ->throw  new InvalidOperationException("Type " + type+" est invalide", ErrorCodes.TYPE_NOT_VALID);
            }
        }
        if(status!=null && !status.isBlank()){
            switch (status.toUpperCase()){
                case "WAITING" ->action.setStatus(ActionStatus.WAITING);
                case "ACCEPTED" ->action.setStatus(ActionStatus.ACCEPTED);
                case "REJECTED" ->action.setStatus(ActionStatus.REJECTED);
                default ->throw  new InvalidOperationException("Statut " + status+" est invalide", ErrorCodes.STATUS_NOT_VALID);

            }
        }
        return action;
    }
    public static ActionDTO toDTO(Action action) {
        ActionDTO actionDTO=new ActionDTO();
        actionDTO.setId(action.getId());
        actionDTO.setIdClient(action.getClient().getId());
        actionDTO.setMailClient(action.getClient().getUsername());
        actionDTO.setType(action.getType().toString());
        try {
            byte[] imageBytes = Files.readAllBytes(Path.of(action.getImage()));
            String base64Icon = Base64.getEncoder().encodeToString(imageBytes);
            actionDTO.setImage(base64Icon);
            actionDTO.setExtension(ImageService.detectExtension(imageBytes));
        } catch (Exception e) {
            actionDTO.setImage(null);
        }
        actionDTO.setDate(action.getCreatedAt());
        actionDTO.setStatus(action.getStatus().name());
        actionDTO.setAwardPoints(action.getAwardPoints());
        if(action.getStatus()== ActionStatus.REJECTED)
            actionDTO.setFeedback(action.getFeedback()!=null? action.getFeedback().getCause():"La raison de refus non précisée.");
        return  actionDTO;
    }
}
