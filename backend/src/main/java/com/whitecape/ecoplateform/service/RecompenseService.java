package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.RecompenseDTO;
import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.enums.GamificationStatus;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.mapper.RecompenseMapper;
import com.whitecape.ecoplateform.repository.ClientRepository;
import com.whitecape.ecoplateform.repository.RecompenseRepository ;
import com.whitecape.ecoplateform.service.Notification.AdminNotificationService;
import com.whitecape.ecoplateform.service.Notification.ClientNotificationService;
import com.whitecape.ecoplateform.validator.RecompenseValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;

import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecompenseService {
    private final RecompenseRepository  recompenseRepository;
    private final ClientRepository clientRepository;
    private final AdminNotificationService adminNotificationService;
    private final ClientNotificationService clientNotificationService;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/uploads/recompenses/";

    @Transactional
    public void addRecompense(RecompenseDTO recompenseDTO){
        RecompenseValidator.validateAdding(recompenseDTO);

        if(recompenseRepository.existsByName(recompenseDTO.getName()))
            throw new InvalidOperationException(
                    "Une récompense avec ce nom existe déjà.",
                    ErrorCodes.NAME_ALREADY_EXISTS);
        Recompense recompense=RecompenseMapper.toEntity(recompenseDTO);

        byte[] imageBytes = Base64.getDecoder().decode(recompenseDTO.getIcon());
        String imagePath = ImageService.saveImage(UPLOAD_DIR, "recompense_",imageBytes,recompenseDTO.getExtension());

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    ImageService.deleteImage(imagePath);
                }
            }
        });
        recompense.setIcon(imagePath);
        recompense=recompenseRepository.save(recompense);

        this.updateSubscribingRecompense(recompense);
    }
    @Transactional
    public void deleteRecompense(Long id){
        Recompense recompense=recompenseRepository.findById(id).orElseThrow(()->new EntityNotFoundException(
                "Pas de récompense avec l'ientifiant "+id+".",
                ErrorCodes.RECOMPENSE_NOT_FOUND
        ));
        String imagePath = recompense.getIcon();
        recompenseRepository.delete(recompense);
        ImageService.deleteImage(imagePath);
    }
    @Transactional
    public void updateRecompense (RecompenseDTO updatedRecompenseDTO){
        RecompenseValidator.validateUpdating(updatedRecompenseDTO);
        Recompense updatedRecompense=RecompenseMapper.toEntity(updatedRecompenseDTO);
        Recompense existingRecompense=recompenseRepository.findById(updatedRecompense.getId()).orElseThrow(()->new EntityNotFoundException(
                "Pas de récompense avec l'ientifiant "+updatedRecompense.getId()+".",
                ErrorCodes.RECOMPENSE_NOT_FOUND
        ));
        if(!StringUtils.hasLength(updatedRecompenseDTO.getDescription()))
            existingRecompense.setDescription(updatedRecompense.getDescription());

        if(updatedRecompenseDTO.getIcon() != null && !Objects.equals(updatedRecompenseDTO.getIcon(), "")) {
            byte[] imageBytes = Base64.getDecoder().decode(updatedRecompenseDTO.getIcon());
            String imagePath = ImageService.updateImage(UPLOAD_DIR, "recompense_",existingRecompense.getIcon(),imageBytes,updatedRecompenseDTO.getExtension());

            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
                @Override
                public void afterCompletion(int status) {
                    if (status == STATUS_ROLLED_BACK) {
                        ImageService.deleteImage(imagePath);
                    }
                }
            });

            existingRecompense.setIcon(imagePath);
        }
        recompenseRepository.save(existingRecompense);
    }
    @Transactional
    public void subscribeRecompenses(Client client) {
        List<Recompense> recompenses = recompenseRepository.findAll();
        if (!recompenses.isEmpty()) {
            for (Recompense recompense : recompenses) {
                int nbreBadgesAchieved = 0;
                for (ClientGamification cg : client.getGamifications()) {
                    if (cg.getGamification() instanceof Badge && cg.getStatus() == GamificationStatus.LOCKED) {
                        nbreBadgesAchieved++;
                    }
                }
                boolean alreadyHas = client.getRecompenses().stream()
                        .anyMatch(r -> r.getId().equals(recompense.getId()));

                if (nbreBadgesAchieved >= recompense.getRequiredBadges() && !alreadyHas) {
                    client.getRecompenses().add(recompense);
                    clientRepository.save(client);
                    clientNotificationService.notifyClient(
                            client,
                            String.format("Félicitations ! Vous avez gagné la récompense %s .", recompense.getName())
                    );

                    adminNotificationService.notifyAdmin(
                            String.format(
                                    "Le client avec l'email %s a gagné la récompense %s.",
                                    client.getMail(),
                                    recompense.getName()
                            )
                    );
                }
            }
        }
    }

    @Transactional
    private void updateSubscribingRecompense(Recompense recompense){
        List<Client>clients=clientRepository.findAll();
        for(Client client:clients){
            int nbreBadgesAchieved = 0;
            for (ClientGamification cg : client.getGamifications()) {
                if (cg.getGamification() instanceof Badge && cg.getStatus() == GamificationStatus.LOCKED) {
                    nbreBadgesAchieved++;
                }
            }

            if (nbreBadgesAchieved >= recompense.getRequiredBadges()) {
                client.getRecompenses().add(recompense);
                clientRepository.save(client);
                clientNotificationService.notifyClient(
                        client,
                        String.format(
                                "Une nouvelle récompense '%s' a été ajoutée. Grâce à votre progression, vous l'avez gagné !",
                                recompense.getName()
                        )
                );

                adminNotificationService.notifyAdmin(
                        String.format(
                                "Le client avec l'email %s a gagné la récompense %s.",
                                client.getMail(),
                                recompense.getName()
                        )
                );
            }else{
                clientNotificationService.notifyClient(
                        client,
                        String.format(
                                "Une nouvelle récompense '%s' a été ajoutée.",
                                recompense.getName()
                        )
                );
            }
        }
    }
}
