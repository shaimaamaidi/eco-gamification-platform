package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.enums.ActionStatus;
import com.whitecape.ecoplateform.enums.GamificationStatus;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.repository.ChallengeRepository;
import com.whitecape.ecoplateform.repository.ClientGamificationRepository;
import com.whitecape.ecoplateform.repository.ClientRepository;
import com.whitecape.ecoplateform.service.Notification.AdminNotificationService;
import com.whitecape.ecoplateform.service.Notification.ClientNotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientGamificationService {
    private final ClientGamificationRepository clientGamificationRepository;
    private final AdminNotificationService adminNotificationService;
    private final ClientNotificationService clientNotificationService;
    private final ClientRepository clientRepository;
    private final ChallengeRepository challengeRepository;
    private final ClassementService classementService;
    private final RecompenseService recompenseService;

    @Transactional
    public void saveClientGamification(ClientGamification cg){
        clientGamificationRepository.save(cg);
    }

    @Transactional
    public void deleteClientGamifications(List<ClientGamification> gamifications){
        clientGamificationRepository.deleteAll(gamifications);
    }

    @Transactional
    public void setStatus(ClientGamification cg ){
        if(cg.getPourcentage()>=100){
            cg.setPourcentage(Math.min(100, cg.getPourcentage()));
            Gamification gamification=cg.getGamification();
            if(gamification instanceof Challenge){
                cg.setStatus(GamificationStatus.COMPLETED);
            }else {
                cg.setStatus(GamificationStatus.LOCKED);
            }
        }else{
            cg.setStatus(GamificationStatus.IN_PROGRESS);
        }
    }
    @Transactional
    public void updateClientGamifications(Client client){
        boolean badgeDebloque;
        do {
            badgeDebloque = false;
            List<ClientGamification> clientGamifications = new ArrayList<>(client.getGamifications());

            for(ClientGamification cg : clientGamifications) {
                Gamification gamification = cg.getGamification();
                if (gamification instanceof Challenge && cg.getStatus() != GamificationStatus.EXPIRED) {
                    Challenge challenge=challengeRepository.findById(gamification.getId()).orElseThrow(()->
                            new EntityNotFoundException("Erreur lors de mise à jour des données.", ErrorCodes.CHALLENGE_NOT_FOUND)
                    );
                    int nbreActions=client.getActions().stream().filter(a->(a.getType()==challenge.getAction() && a.getStatus()== ActionStatus.ACCEPTED)).toList().size();
                    double pourcentage = (gamification.getGoal() != 0)
                            ? ((double) nbreActions / gamification.getGoal()) * 100
                            : 100;
                    GamificationStatus oldStatus=cg.getStatus();
                    cg.setPourcentage(pourcentage);
                    this.setStatus(cg);
                    this.saveClientGamification(cg);
                    if(cg.getStatus()==GamificationStatus.COMPLETED && cg.getStatus()!=oldStatus){
                        clientNotificationService.notifyClient(
                                client,
                                String.format("Félicitations ! Vous avez complété le défis %s .", gamification.getTitle())
                        );
                        adminNotificationService.notifyAdmin(
                                String.format(
                                        "Le client avec l'email %s a complété le défis %s.",
                                        client.getMail(),
                                        gamification.getTitle()
                                )
                        );
                    }

                } else if (gamification instanceof Badge) {
                    double pourcentage = (gamification.getGoal() != 0)
                            ? ((double) client.getTotalPoints() / gamification.getGoal()) * 100
                            : 100;

                    GamificationStatus oldStatus=cg.getStatus();
                    cg.setPourcentage(pourcentage);
                    this.setStatus(cg);

                    clientGamificationRepository.save(cg);

                    if(cg.getStatus()==GamificationStatus.LOCKED && cg.getStatus()!=oldStatus){
                        badgeDebloque = true;

                        client.setTotalPoints(client.getTotalPoints() + gamification.getGoal());
                        clientRepository.save(client);

                        classementService.updateClassementsClient(client,client.getTotalPoints(),null);

                        recompenseService.subscribeRecompenses(client);

                        clientNotificationService.notifyClient(
                                client,
                                String.format("Félicitations ! Vous avez débloqué le badge %s .", gamification.getTitle())
                        );

                        adminNotificationService.notifyAdmin(
                                String.format(
                                        "Le client avec l'email %s a débloqué le badge %s.",
                                        client.getMail(),
                                        gamification.getTitle()
                                )
                        );
                    }
                }else{
                    throw new RuntimeException("Erreur interne lors de mise à jour des gamidications.");
                }
            }
        } while (badgeDebloque);
    }

    public ClientGamification getByGamificationIdAndClientId(Long idGamification,Long idClient){
        return clientGamificationRepository.findByGamificationIdAndClientId(idGamification, idClient).orElse(null);
    }
}