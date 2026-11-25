package com.whitecape.ecoplateform.controller;


import com.whitecape.ecoplateform.dto.ActionDTO;
import com.whitecape.ecoplateform.dto.BadgeDTO;
import com.whitecape.ecoplateform.dto.ChallengeDTO;
import com.whitecape.ecoplateform.dto.RecompenseDTO;
import com.whitecape.ecoplateform.dto.statistiques.UserStatsSummaryDTO;
import com.whitecape.ecoplateform.service.ClientProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/client/profile")
public class ClientProfileController {
    @Autowired
    private ClientProfileService clientProfileService;
    @GetMapping("actions/{idClient}")
    public ResponseEntity<List<ActionDTO>> getActionsByClient(@PathVariable Long idClient) {
        return ResponseEntity.ok(clientProfileService.getActionsByClient(idClient));
    }

    //Récupérer tous les badges avec la progression pour un client donné
    @GetMapping("/{idClient}/badges")
    public ResponseEntity<List<BadgeDTO>> getAllBadgesWithProgress(@PathVariable Long idClient) {
        return ResponseEntity.ok(clientProfileService.getAllBadgesWithProgress(idClient));
    }

    //Récupérer tous les challenges avec la progression pour un client donné
    @GetMapping("/{idClient}/challenges/current")
    public ResponseEntity<List<ChallengeDTO>> getCurrentChallengesWithProgress(@PathVariable Long idClient) {
        return ResponseEntity.ok(clientProfileService.getCurrentChallengeWithProgress(idClient));
    }

    @GetMapping("/{idClient}/recompenses")
    public ResponseEntity<List<RecompenseDTO>> getAllRecompenses(@PathVariable Long idClient) {
        return ResponseEntity.ok(clientProfileService.getRecompensesWithProgress(idClient));
    }

    @GetMapping("/{idClient}/stats")
    public ResponseEntity<UserStatsSummaryDTO> getAchievementsStats(@PathVariable Long idClient) {
        return ResponseEntity.ok(clientProfileService.getAchievementsStats(idClient));
    }
}

