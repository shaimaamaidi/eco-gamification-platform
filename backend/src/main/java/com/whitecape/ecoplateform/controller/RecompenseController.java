package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.RecompenseDTO;
import com.whitecape.ecoplateform.service.RecompenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recompenses")
public class RecompenseController {
    @Autowired
    private RecompenseService recompenseService;

    @PostMapping
    public ResponseEntity<String> addRecompense(@RequestBody RecompenseDTO recompense) {
        recompenseService.addRecompense(recompense);
        return ResponseEntity.status(HttpStatus.CREATED).body("Récompense ajoutée avec succès.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecompense(@PathVariable Long id) {
        recompenseService.deleteRecompense(id);
        return ResponseEntity.ok("Récompense supprimée avec succès.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRecompense(@PathVariable Long id, @RequestBody RecompenseDTO updatedRecompense)  {
        updatedRecompense.setId(id);
        recompenseService.updateRecompense(updatedRecompense);
        return ResponseEntity.ok("Récompense mise à jour avec succès.");
    }
}
