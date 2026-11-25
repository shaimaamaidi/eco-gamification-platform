package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.ChallengeDTO;
import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.enums.ActionStatus;
import com.whitecape.ecoplateform.enums.GamificationStatus;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.mapper.ChallengeMapper;
import com.whitecape.ecoplateform.repository.ChallengeRepository;
import com.whitecape.ecoplateform.repository.ClientRepository;
import com.whitecape.ecoplateform.service.Notification.AdminNotificationService;
import com.whitecape.ecoplateform.service.Notification.ClientNotificationService;
import com.whitecape.ecoplateform.validator.ChallengeValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final ClientRepository clientRepository;
    private final ClientGamificationService clientGamificationService;
    private final AdminNotificationService adminNotificationService;
    private final ClientNotificationService clientNotificationService;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/uploads/challenges/";

    @Transactional
    public void addChallenge(ChallengeDTO challengeDTO) {
        ChallengeValidator.validateAdding(challengeDTO);
        Challenge challenge= ChallengeMapper.toEntity(challengeDTO);
        if(challengeRepository.existsByTitle(challenge.getTitle()))
            throw new InvalidOperationException(
                    "Un défis avec ce titre existe déjà.",
                    ErrorCodes.TITLE_ALREADY_EXISTS
            );
        byte[] imageBytes = Base64.getDecoder().decode(challengeDTO.getIcon());
        String imagePath = ImageService.saveImage(UPLOAD_DIR, "challenge_",imageBytes,challengeDTO.getExtension());
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    ImageService.deleteImage(imagePath);
                }
            }
        });
        challenge.setIcon(imagePath);
        Challenge savedChallenge = challengeRepository.save(challenge);
        this.addNewClientGamification(savedChallenge);
    }
    @Transactional
    public void deleteChallenge(Long id) {
        Challenge challenge=challengeRepository.findById(id).orElseThrow(()-> new EntityNotFoundException(
                "Pas de défis avec cet identifiant.",
                ErrorCodes.CHALLENGE_NOT_FOUND
        ));
        String imagePath = challenge.getIcon();

        clientGamificationService.deleteClientGamifications(challenge.getClientGamifications());
        challengeRepository.delete(challenge);

        ImageService.deleteImage(imagePath);
    }

    @Scheduled(cron = "0 0 0 * * ?") // tous les jours à minuit
    @Transactional
    public void updateChallengeExpiredStatus() {
        LocalDate today = LocalDate.now();

        List<Challenge> finishedChallenge = challengeRepository.findByEndDateBefore(today);

        for (Challenge challenge : finishedChallenge) {
            List<ClientGamification> clientGamifications = challenge.getClientGamifications();

            for (ClientGamification cg : clientGamifications) {
                cg.setStatus(GamificationStatus.EXPIRED);
                clientGamificationService.saveClientGamification(cg);
                clientNotificationService.notifyClient(
                        cg.getClient(),
                        String.format(
                                "Le défis '%s' a été éxpiré.",
                                challenge.getTitle()
                        )
                );
            }
            adminNotificationService.notifyAdmin(
                    String.format(
                            "Le défis '%s' a été éxpiré.",
                            challenge.getTitle()
                    )
            );
        }
    }
    @Transactional
    public void updateChallenge(ChallengeDTO updatedChallengeDTO){
        ChallengeValidator.validateUpdation(updatedChallengeDTO);


        Challenge existingChallenge=challengeRepository.findById(updatedChallengeDTO.getId()).orElseThrow(()->new EntityNotFoundException(
                "Pas de défis avec l'identifiant :"+updatedChallengeDTO.getId()+".",
                ErrorCodes.CHALLENGE_NOT_VALID));

        if(StringUtils.hasLength(updatedChallengeDTO.getDescription()))
            existingChallenge.setDescription(updatedChallengeDTO.getDescription());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        if (updatedChallengeDTO.getEndDate() != null && !updatedChallengeDTO.getEndDate().isBlank()) {
            existingChallenge.setEndDate(LocalDate.parse(updatedChallengeDTO.getEndDate(), formatter));
        }
        if(updatedChallengeDTO.getIcon() != null && !Objects.equals(updatedChallengeDTO.getIcon(), "")){
            byte[] imageBytes = Base64.getDecoder().decode(updatedChallengeDTO.getIcon());
            String imagePath = ImageService.updateImage(UPLOAD_DIR, "challenge_",existingChallenge.getIcon(),imageBytes,updatedChallengeDTO.getExtension());

            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
                @Override
                public void afterCompletion(int status) {
                    if (status == STATUS_ROLLED_BACK) {
                        ImageService.deleteImage(imagePath);
                    }
                }
            });
            existingChallenge.setIcon(imagePath);
        }

        challengeRepository.save(existingChallenge);

    }

    @Transactional
    public void createClientGamificationForNewClient(Client client){
        List<Challenge> challenges=challengeRepository.findAll();
        if(!challenges.isEmpty()){
            for(Challenge challenge:challenges){
                ClientGamification cg = new ClientGamification();
                cg.setClient(client);
                cg.setGamification(challenge);
                if(challenge.getGoal()==0)
                    cg.setPourcentage(100);
                else
                    cg.setPourcentage(0);
                clientGamificationService.setStatus(cg);
                clientGamificationService.saveClientGamification(cg);
            }
        }
    }
    @Transactional
    private void addNewClientGamification(Challenge challenge){
        List<Client> clients = clientRepository.findAll();

        for (Client client : clients) {
            ClientGamification cg = new ClientGamification();
            cg.setClient(client);
            cg.setGamification(challenge);
            int nbreActions=client.getActions().stream().filter(a->(a.getType()==challenge.getAction() && a.getStatus()== ActionStatus.ACCEPTED)).toList().size();
            double pourcentage = (challenge.getGoal() != 0)
                    ? ((double) nbreActions / challenge.getGoal()) * 100
                    : 100;

            cg.setPourcentage(pourcentage);
            clientGamificationService.setStatus(cg);

            clientGamificationService.saveClientGamification(cg);

            challenge.getClientGamifications().add(cg);

            if(cg.getPourcentage()>0){
                clientNotificationService.notifyClient(
                        client,
                        String.format(
                                "Un nouveau défis '%s' a été ajouté. Grâce à votre progression, votre score initial pour ce badge est de  %.1f%% !",
                                challenge.getTitle(),
                                cg.getPourcentage()
                        )
                );
            }else{
                clientNotificationService.notifyClient(
                        client,
                        String.format(
                                "Un nouveau défis '%s' a été ajouté.",
                                challenge.getTitle()
                        )
                );
            }
        }
        challengeRepository.save(challenge);
    }
}
