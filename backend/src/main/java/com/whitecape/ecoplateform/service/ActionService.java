package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.ActionDTO;
import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.enums.ActionStatus;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.mapper.ActionMapper;
import com.whitecape.ecoplateform.repository.ActionRepository;
import com.whitecape.ecoplateform.repository.ClientRepository;
import com.whitecape.ecoplateform.service.Notification.AdminNotificationService;
import com.whitecape.ecoplateform.service.Notification.ClientNotificationService;
import com.whitecape.ecoplateform.validator.ActionValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class ActionService {
    private final ActionRepository actionRepository;
    private final ClientRepository clientRepository;
    private final ClientGamificationService clientGamificationService;
    private final ClassementService classementService;
    private final RecompenseService recompenseService;
    private final AdminNotificationService adminNotificationService;
    private final ClientNotificationService clientNotificationService;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/uploads/actions/";
    //un client ajoute une action
    @Transactional
    public void addAction(ActionDTO actionDTO) {
        ActionValidator.validate(actionDTO);

        Client client = clientRepository.findById(actionDTO.getIdClient())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucun client avec l'identifiant = " + actionDTO.getIdClient(),
                        ErrorCodes.CLIENT_NOT_FOUND
                ));

        Action action= ActionMapper.toEntity(actionDTO);

        byte[] imageBytes = Base64.getDecoder().decode(actionDTO.getImage());
        String imagePath = ImageService.saveImage(UPLOAD_DIR, "action_", imageBytes,actionDTO.getExtension());

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    ImageService.deleteImage(imagePath);
                }
            }
        });
        action.setImage(imagePath);
        action.setStatus(ActionStatus.WAITING);
        action.setClient(client);
        action.setFeedback(null);
        actionRepository.save(action);

        adminNotificationService.notifyAdmin(String.format("Nouvelle action signalée par le client %s",client.getDisplayName()));
    }
    @Transactional
    //un admin evalue une action et attribue des points
    public void accepteAction(Long id){
        Action action = actionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucun action avec l'ID' = " + id,
                        ErrorCodes.ACTION_NOT_FOUND
                ));
        if (action.getStatus() != ActionStatus.WAITING) {
            throw new InvalidOperationException(
                    "Cette action ne peut pas être acceptée car elle a déjà été traitée.",
                    ErrorCodes.ACTION_NOT_VALID
            );
        }
        Client client=action.getClient();

        action.setStatus(ActionStatus.ACCEPTED);
        int points=action.getType().getPoints();
        action.setAwardPoints(points);
        actionRepository.save(action);

        client.setTotalPoints(client.getTotalPoints()+points);
        client=clientRepository.save(client);

        classementService.updateClassementsClient(client,points,action.getType());

        clientGamificationService.updateClientGamifications(client);

        recompenseService.subscribeRecompenses(client);

        clientNotificationService.notifyClient(client, "Nous vous informons qu'il y a une action a été validée avec succès.");
    }
    @Transactional
    public void refuseAction (ActionDTO actionDTO){
        ActionValidator.validateRefusing(actionDTO);

        Action action = actionRepository.findById(actionDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucun action avec l'ID' = " + actionDTO.getId(),
                        ErrorCodes.ACTION_NOT_FOUND
                ));
        if (action.getStatus() != ActionStatus.WAITING) {
            throw new InvalidOperationException(
                    "Cette action ne peut pas être refusée car elle a déjà été traitée.",
                    ErrorCodes.ACTION_NOT_VALID
            );
        }
        action.setStatus(ActionStatus.REJECTED);
        Feedback feedback=new Feedback();
        feedback.setCause(actionDTO.getFeedback());

        action.setFeedback(feedback);
        actionRepository.save(action);

        clientNotificationService.notifyClient(action.getClient(), "Nous vous informons qu'il y a une action a été rejetée.");
    }
}
