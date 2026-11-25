package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.BadgeDTO;
import com.whitecape.ecoplateform.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {
    @Autowired
    private BadgeService badgeService;

    @PostMapping
    public ResponseEntity<String> addBadge(@RequestBody BadgeDTO badge) {
        badgeService.addBadge(badge);
        return ResponseEntity.status(HttpStatus.CREATED).body("Badge ajouté avec succès.");
    }

    @DeleteMapping("/badges/{id}")
    public ResponseEntity<String> deleteBadge(@PathVariable Long id)  {
        badgeService.deleteBadge(id);
        return ResponseEntity.ok("Badge supprimé avec succès.");
    }

    @PutMapping("/badges/{id}")
    public ResponseEntity<String> updateBadge(@PathVariable Long id, @RequestBody BadgeDTO updatedBadge) {
        updatedBadge.setId(id);
        System.out.println("hello");
        badgeService.updateBadge(updatedBadge);
        return ResponseEntity.ok("Badge mis à jour avec succès.");
    }
}
