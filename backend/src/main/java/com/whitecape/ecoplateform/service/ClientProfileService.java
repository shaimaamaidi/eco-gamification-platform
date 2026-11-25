package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.ActionDTO;
import com.whitecape.ecoplateform.dto.BadgeDTO;
import com.whitecape.ecoplateform.dto.ChallengeDTO;
import com.whitecape.ecoplateform.dto.RecompenseDTO;
import com.whitecape.ecoplateform.dto.statistiques.UserStatsSummaryDTO;
import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.enums.GamificationStatus;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.mapper.ActionMapper;
import com.whitecape.ecoplateform.mapper.BadgeMapper;
import com.whitecape.ecoplateform.mapper.ChallengeMapper;
import com.whitecape.ecoplateform.mapper.RecompenseMapper;
import com.whitecape.ecoplateform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientProfileService {
    private final ChallengeRepository challengeRepository;
    private final BadgeRepository badgeRepository;
    private final ClientGamificationService clientGamificationService;
    private final RecompenseRepository recompenseRepository;
    private final ClientRepository clientRepository;

    public List<ActionDTO> getActionsByClient(Long idClient){
        Client client = clientRepository.findById(idClient)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aucun client avec l'identifiant : " + idClient,
                        ErrorCodes.CLIENT_NOT_FOUND
                ));

        return client.getActions().stream()
                .map(ActionMapper::toDTO)
                .toList();
    }
    public List<BadgeDTO> getAllBadgesWithProgress(Long idClient) {
        return badgeRepository.findAll().stream()
                .sorted(Comparator.comparing(Badge::getId))
                .map(badge -> {
                    ClientGamification cg=clientGamificationService.getByGamificationIdAndClientId(badge.getId(),idClient);
                    return BadgeMapper.toDTO(badge,cg.getPourcentage());
                })
                .toList();
    }
    public List<ChallengeDTO> getCurrentChallengeWithProgress(Long idClient){
        //les défis dont date de fin > today
        LocalDate today=LocalDate.now();

        List<Challenge> challenges=challengeRepository.findByEndDateAfter(today);

        return challenges.stream()
                .sorted(Comparator.comparing(Challenge::getId))
                .map(challenge ->{
                    ClientGamification cg=clientGamificationService.getByGamificationIdAndClientId(challenge.getId(),idClient);
                    return ChallengeMapper.toDTO(challenge,cg.getPourcentage());
                })
                .toList();
    }

    public List<RecompenseDTO> getRecompensesWithProgress(Long idClient) {
        Client client=clientRepository.findById(idClient).orElseThrow(() ->
                new EntityNotFoundException("Aucun client trouvé avec l'identifiant : " + idClient+".", ErrorCodes.CLIENT_NOT_FOUND)
        );
        int nbreBadgesAchieved = 0;
        for (ClientGamification cg : client.getGamifications()) {
            if (cg.getGamification() instanceof Badge && cg.getStatus() == GamificationStatus.LOCKED) {
                nbreBadgesAchieved++;
            }
        }
        List<RecompenseDTO> recompensesDTOs=new ArrayList<>();

        List<Recompense> recompenses = recompenseRepository.findAll();
        if (!recompenses.isEmpty()) {
            recompenses=recompenses.stream().sorted(Comparator.comparing(Recompense::getId)).toList();
            for (Recompense recompense : recompenses) {
                int requiredBadges= recompense.getRequiredBadges();
                double progress=(requiredBadges!=0)? ((double) nbreBadgesAchieved / requiredBadges) *100 : 100 ;
                progress= (progress>100)? 100 : progress;
                recompensesDTOs.add(RecompenseMapper.toDTO(recompense,progress));

            }
        }
        return recompensesDTOs;
    }

    public UserStatsSummaryDTO getAchievementsStats(Long idClient){
        Client client=clientRepository.findById(idClient).orElseThrow(() ->
                new EntityNotFoundException("Aucun client trouvé avec l'identifiant : " + idClient+".", ErrorCodes.CLIENT_NOT_FOUND)
        );
        int badgeLocked=0;
        int challengeCompleted=0;
        int recompenceTaked=0;
        for(ClientGamification cg: client.getGamifications()){
           if(cg.getGamification() instanceof Badge && cg.getStatus() == GamificationStatus.LOCKED)
               badgeLocked++;
           if(cg.getGamification() instanceof Challenge && cg.getStatus() == GamificationStatus.COMPLETED)
               challengeCompleted++;
        }
        List<Recompense> recompenses = recompenseRepository.findAll();
        if (!recompenses.isEmpty()) {
            for (Recompense recompense : recompenses) {
                int requiredBadges= recompense.getRequiredBadges();
                if(badgeLocked>=requiredBadges)
                    recompenceTaked++;

            }
        }
        return new UserStatsSummaryDTO(badgeLocked,challengeCompleted,recompenceTaked);
    }
}
