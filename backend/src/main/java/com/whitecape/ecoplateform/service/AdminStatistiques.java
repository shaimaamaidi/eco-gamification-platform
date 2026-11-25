package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.*;
import com.whitecape.ecoplateform.dto.statistiques.*;
import com.whitecape.ecoplateform.entity.*;
import com.whitecape.ecoplateform.mapper.*;
import com.whitecape.ecoplateform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStatistiques {
    private final ClientRepository clientRepository;
    private final ActionRepository actionRepository;
    private final BadgeRepository badgeRepository;
    private final ChallengeRepository challengeRepository;
    private final RecompenseRepository recompenseRepository;

    // ---------- Clients ----------
    //getAllClients
    public long countAllClient(){
        return clientRepository.findAll().size();
    }
    // nombre total des clients aujourduil et hier
    public List<DailyStatsDTO> countClientsTodayAndYesterday() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        Long todayCount = clientRepository.countClientsByCreatedAtDate(today);
        Long yesterdayCount = clientRepository.countClientsByCreatedAtDate(yesterday);

        List<DailyStatsDTO> result=new ArrayList<>();
        result.add(new DailyStatsDTO(yesterday,yesterdayCount));
        result.add(new DailyStatsDTO(today,todayCount));
        return result;
    }
    //nombre total des clients vérifiés aujourduil et hier
    public Long countEnabledClientsToday() {
        LocalDate today = LocalDate.now();
        return clientRepository.countEnabledClientsByCreatedAtDate(today);
    }

    //nbre de clients actifs dans les 7 derniers jours
    public Long countActiveClientsLast7Days(){
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);
        return actionRepository.countDistinctClientsByCreatedAtBetween(sevenDaysAgo, today);
    }


    //courbe cumulative das clients
    public List<DailyStatsDTO> getCumulativeClientCountPerDay() {
        List<Object[]> dailyCounts = clientRepository.countClientsByCreationDatePerDay();

        List<DailyStatsDTO> result=new ArrayList<>();
        long cumulative = 0;

        for (Object[] row : dailyCounts) {
            LocalDate date = (LocalDate) row[0];
            Long count = (Long) row[1];
            cumulative += count;
            DailyStatsDTO dailyStatsDTO=new DailyStatsDTO(date, cumulative);
            result.add(dailyStatsDTO);
        }
        return result;
    }
    // ---------- Actions ----------
    public List<ActionDTO> getAllActions(){
        return actionRepository.findAll().stream()
                .map(ActionMapper::toDTO)
                .toList();
    }
    public List<DailyActionStatsDTO> getDailyActionStatsGroupedByTypeAndStatus() {
        List<Object[]> results = actionRepository.countActionsGroupedByDayAndTypeAndStatus();
        return results.stream()
                .map(row -> new DailyActionStatsDTO(
                        (LocalDate) row[0],// date
                        row[1].toString(),                      // type
                        row[2].toString(),                      // status
                        ((Number) row[3]).longValue()           // total
                ))
                .toList();
    }
    // ---------- Badges ----------
    public List<BadgeDTO> getAllBadges() {
        return badgeRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Badge::getId))
                .map(badge -> BadgeMapper.toDTO(badge, this.getSucessRateByBadge(badge)))
                .toList();
    }
    private double getSucessRateByBadge(Badge badge){
        double progress =0 ;
        for(ClientGamification cg : badge.getClientGamifications()){
            if(cg.getPourcentage()==100){
                progress++;
            }
        }
        return (!badge.getClientGamifications().isEmpty()) ? ((progress/badge.getClientGamifications().size())*100) : 100 ;

    }
    public double getSucessRateForBadge(){
        List<Badge> badges=badgeRepository.findAll();
        double rate=0;
        for(Badge badge: badges) {
            rate+=getSucessRateByBadge(badge);
        }
        return (!badges.isEmpty()) ? (rate/badges.size()) : 100;
    }

    // ---------- Challenges ----------
    public List<ChallengeDTO> getAllChallenges() {
        return challengeRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Challenge::getId))
                .map(challenge -> ChallengeMapper.toDTO(challenge,this.getSucessRateByChallenge(challenge)))
                .toList();
    }
    private double getSucessRateByChallenge(Challenge challenge){
        double progress=0;
        for(ClientGamification cg : challenge.getClientGamifications()){
            if(cg.getPourcentage()==100){
                progress++;
            }
        }
        return (!challenge.getClientGamifications().isEmpty()) ? ((progress/challenge.getClientGamifications().size())*100) : 100;
    }
    public double getSucessRateForChallenge(){
        List<Challenge> challenges=challengeRepository.findAll();
        double rate=0;
        for(Challenge challenge : challenges){
            rate+=getSucessRateByChallenge(challenge);
        }
        return (!challenges.isEmpty()) ? (rate/challenges.size()) : 100;
    }

    // ---------- Récompenses ----------
    public List<RecompenseDTO> getAllRecompenses(){
        return recompenseRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Recompense::getId))
                .map(recompense -> {
                    int size=clientRepository.findAll().size();
                    double progress = (size != 0)
                            ? ((double) recompense.getClients().size() / size) * 100
                            : 100;
                    return RecompenseMapper.toDTO(recompense,progress);
                })
                .toList();
    }
    public double getSucessRateForRecompense(){
        List<Recompense> recompenses=recompenseRepository.findAll();
        double rate=0;
        for(Recompense recompense:recompenses){
            if(recompense.getClients()!=null && !recompense.getClients().isEmpty()){
                rate++;
            }
        }
        return (!recompenses.isEmpty()) ? (rate/recompenses.size())*100 : 100;
    }
}
