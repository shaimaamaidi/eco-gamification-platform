package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.ChallengeDTO;
import com.whitecape.ecoplateform.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<String> addChallenge(@RequestBody ChallengeDTO challengeDTO ) {
        challengeService.addChallenge(challengeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Défis ajouté avec succès.");
    }

    @DeleteMapping("/challenges/{id}")
    public ResponseEntity<String> deleteChallenge(@PathVariable Long id)  {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok("Défis supprimé avec succès.");
    }

    @PutMapping("/challenges/{id}")
    public ResponseEntity<String> updateChallenge(@PathVariable Long id, @RequestBody ChallengeDTO updatedChallenge) {
        updatedChallenge.setId(id);
        challengeService.updateChallenge(updatedChallenge);
        return ResponseEntity.ok("Défis mis à jour avec succès.");
    }

}
