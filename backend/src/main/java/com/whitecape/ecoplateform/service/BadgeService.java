package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.BadgeDTO;
import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.enums.GamificationStatus;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.mapper.BadgeMapper;
import com.whitecape.ecoplateform.repository.BadgeRepository;
import com.whitecape.ecoplateform.repository.ClientRepository;
import com.whitecape.ecoplateform.service.Notification.ClientNotificationService;
import com.whitecape.ecoplateform.validator.BadgeValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;

import java.util.Base64;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BadgeService {
    private final BadgeRepository badgeRepository;
    private final ClientRepository clientRepository;
    private final ClassementService classementService;
    private final RecompenseService recompenseService;
    private final ClientGamificationService clientGamificationService;
    private final ClientNotificationService clientNotificationService;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/uploads/badges/";
    @Transactional
    public void addBadge(BadgeDTO badgeDTO){
        BadgeValidator.validateAdding(badgeDTO);

        Badge badge= BadgeMapper.toEntity(badgeDTO);

        if (badgeRepository.existsByTitle(badge.getTitle())) {
            throw new InvalidOperationException(
                    "Un badge avec ce titre existe deja.",
                    ErrorCodes.TITLE_ALREADY_EXISTS
            );
        } else {
            byte[] imageBytes = Base64.getDecoder().decode(badgeDTO.getIcon());
            String imagePath = ImageService.saveImage(UPLOAD_DIR, "badge_", imageBytes,badgeDTO.getExtension());

            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
                @Override
                public void afterCompletion(int status) {
                    if (status == STATUS_ROLLED_BACK) {
                        ImageService.deleteImage(imagePath);
                    }
                }
            });
            badge.setIcon(imagePath);
            Badge savedBadge = badgeRepository.save(badge);
            this.addNewClientGamification(savedBadge);
        }

    }
    @Transactional
    public void deleteBadge(Long id){
        Badge badge =badgeRepository.findById(id).orElseThrow(()->new EntityNotFoundException(
                "Pas de badge avec l'identifiant :"+id+".",
                ErrorCodes.BADGE_NOT_FOUND));

        String imagePath = badge.getIcon();

        clientGamificationService.deleteClientGamifications(badge.getClientGamifications());
        badgeRepository.delete(badge);
        ImageService.deleteImage(imagePath);
    }
    @Transactional
    public void updateBadge(BadgeDTO updatedBadgeDTO){
        BadgeValidator.validateUpdation(updatedBadgeDTO);

        Badge updatedBadge=BadgeMapper.toEntity(updatedBadgeDTO);

        Badge existingBadge=badgeRepository.findById(updatedBadge.getId()).orElseThrow(()->new EntityNotFoundException(
                "Pas de badge avec l'identifiant :"+updatedBadge.getId()+".",
                ErrorCodes.BADGE_NOT_FOUND));

        if(updatedBadgeDTO.getDescription()!=null && StringUtils.hasLength(updatedBadgeDTO.getDescription()) )
            existingBadge.setDescription(updatedBadge.getDescription());

        if(updatedBadgeDTO.getIcon() != null && !Objects.equals(updatedBadge.getIcon(), "")) {
            byte[] imageBytes = Base64.getDecoder().decode(updatedBadgeDTO.getIcon());
            String imagePath = ImageService.updateImage(UPLOAD_DIR, "badge_",existingBadge.getIcon(), imageBytes,updatedBadgeDTO.getExtension());

            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
                @Override
                public void afterCompletion(int status) {
                    if (status == STATUS_ROLLED_BACK) {
                        ImageService.deleteImage(imagePath);
                    }
                }
            });
            existingBadge.setIcon(imagePath);
        }

        badgeRepository.save(existingBadge);
    }
    @Transactional
    public void createClientGamificationForNewClient(Client client){
        List<Badge> badges=badgeRepository.findAll();
        if(!badges.isEmpty()){
            for(Badge badge:badges){
                ClientGamification cg = new ClientGamification();
                cg.setClient(client);
                cg.setGamification(badge);
                if(badge.getGoal()==0)
                    cg.setPourcentage(100);
                else
                    cg.setPourcentage(0);
                clientGamificationService.setStatus(cg);
                clientGamificationService.saveClientGamification(cg);
            }
        }
    }
    @Transactional
    private void addNewClientGamification(Badge badge){
        List<Client> clients = clientRepository.findAll();

        for (Client client : clients) {
            ClientGamification cg = new ClientGamification();

            cg.setClient(client);
            cg.setGamification(badge);
            double pourcentage = (badge.getGoal() != 0)
                    ? ((double) client.getTotalPoints() / badge.getGoal()) * 100
                    : 100;
            cg.setPourcentage(pourcentage);
            clientGamificationService.setStatus(cg);

            clientGamificationService.saveClientGamification(cg);

            badge.getClientGamifications().add(cg);
            if(cg.getStatus()== GamificationStatus.LOCKED){
                client.setTotalPoints(client.getTotalPoints() + badge.getGoal());
                clientRepository.save(client);

                classementService.updateClassementsClient(client,client.getTotalPoints(),null);

                clientGamificationService.updateClientGamifications(client);

                recompenseService.subscribeRecompenses(client);
            }
            if(cg.getPourcentage()>0){
                clientNotificationService.notifyClient(
                        client,
                        String.format(
                                "Un nouveau badge '%s' a été ajouté. Grâce à votre progression, votre score initial pour ce badge est de  %.1f%% !",
                                badge.getTitle(),
                                cg.getPourcentage()
                        )
                );
            }else{
                clientNotificationService.notifyClient(
                        client,
                        String.format(
                                "Un nouveau badge '%s' a été ajouté.",
                                badge.getTitle()
                        )
                );
            }
        }
        badgeRepository.save(badge);
    }
}
