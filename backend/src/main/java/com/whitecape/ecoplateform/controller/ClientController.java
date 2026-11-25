package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.ClientDTO;
import com.whitecape.ecoplateform.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @PutMapping("/{id}")
    public ResponseEntity<String> updateClient(@PathVariable Long id, @RequestBody ClientDTO updatedClient) {
        updatedClient.setId(id);
        clientService.updateClient(updatedClient);
        return ResponseEntity.ok("Client mis à jour avec succès.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok("Client supprimé avec succès.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientDetails(@PathVariable Long id) {
        ClientDTO client = clientService.getClient(id);
        return ResponseEntity.ok(client);
    }
}

