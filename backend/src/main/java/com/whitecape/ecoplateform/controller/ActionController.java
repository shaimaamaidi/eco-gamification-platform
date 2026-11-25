package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.ActionDTO;
import com.whitecape.ecoplateform.service.ActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/actions")
public class ActionController {

    @Autowired
    private ActionService actionService;

    @PostMapping(value = "/{idClient}")
    public ResponseEntity<String> addAction(@PathVariable Long idClient, @ModelAttribute ActionDTO actionDTO) {
        actionDTO.setIdClient(idClient);
        actionService.addAction(actionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Action ajoutée avec succès.");
    }
    @PutMapping("/accept/{id}")
    public ResponseEntity<String> acceptAction(@PathVariable Long id) {
        actionService.accepteAction(id);
        return ResponseEntity.ok("Action acceptée et points attribués avec succès.");
    }
    @PutMapping("/reject/{id}")
    public ResponseEntity<String> rejectAction(@PathVariable Long id,@RequestBody ActionDTO actionDTO) {
        actionDTO.setId(id);
        actionService.refuseAction(actionDTO);
        return ResponseEntity.ok("Action refusée avec succès.");
    }
}
