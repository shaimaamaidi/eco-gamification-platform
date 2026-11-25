package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.*;
import com.whitecape.ecoplateform.dto.statistiques.*;
import com.whitecape.ecoplateform.service.AdminStatistiques;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/statistics")
public class AdminStatsController {
    @Autowired
    private AdminStatistiques adminStatistiques;

    // ---------- Clients ----------
    @GetMapping("/count")
    public ResponseEntity<Long> countAllClients() {
        return ResponseEntity.ok(adminStatistiques.countAllClient());
    }

    @GetMapping("/clients/daily")
    public ResponseEntity<List<DailyStatsDTO>> getClientsTodayAndYesterday() {
        return ResponseEntity.ok(adminStatistiques.countClientsTodayAndYesterday());
    }

    @GetMapping("/clients/daily/enabled")
    public ResponseEntity<Long> getEnabledClientsToday() {
        return ResponseEntity.ok(adminStatistiques.countEnabledClientsToday());
    }

    @GetMapping("/clients/active/last7days")
    public ResponseEntity<Long> getActiveClientsLast7Days() {
        return ResponseEntity.ok(adminStatistiques.countActiveClientsLast7Days());
    }

    @GetMapping("/clients/cumulative")
    public ResponseEntity<List<DailyStatsDTO>> getCumulativeClients() {
        return ResponseEntity.ok(adminStatistiques.getCumulativeClientCountPerDay());
    }

    // ---------- Actions ----------
    @GetMapping
    public ResponseEntity<List<ActionDTO>> getAllActions() {
        return ResponseEntity.ok(adminStatistiques.getAllActions());
    }
    @GetMapping("/daily-stats")
    public ResponseEntity<List<DailyActionStatsDTO>> getDailyActionStats() {
        return ResponseEntity.ok(adminStatistiques.getDailyActionStatsGroupedByTypeAndStatus());
    }

    // ---------- Badges ----------
    @GetMapping("/badges")
    public ResponseEntity<List<BadgeDTO>> getAllBadges() {
        return ResponseEntity.ok(adminStatistiques.getAllBadges());
    }

    @GetMapping("/badges/success-rate")
    public ResponseEntity<Double> getBadgeSuccessRate() {
        return ResponseEntity.ok(adminStatistiques.getSucessRateForBadge());
    }

    // ---------- Challenges ----------
    @GetMapping("/challenges")
    public ResponseEntity<List<ChallengeDTO>> getAllChallenges() {
        return ResponseEntity.ok(adminStatistiques.getAllChallenges());
    }

    @GetMapping("/challenges/success-rate")
    public ResponseEntity<Double> getChallengeSuccessRate() {
        return ResponseEntity.ok(adminStatistiques.getSucessRateForChallenge());
    }

    // ---------- Récompenses ----------

    @GetMapping("/recompenses")
    public ResponseEntity<List<RecompenseDTO>> getAllRecompenses() {
        return ResponseEntity.ok(adminStatistiques.getAllRecompenses());
    }
    @GetMapping("/recompenses/success-rate")
    public ResponseEntity<Double> getRecompenseSuccessRate() {
        return ResponseEntity.ok(adminStatistiques.getSucessRateForRecompense());
    }
}

