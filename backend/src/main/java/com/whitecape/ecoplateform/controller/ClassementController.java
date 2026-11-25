package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.ClientDTO;
import com.whitecape.ecoplateform.service.ClassementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classements")
public class ClassementController {

    @Autowired
    private ClassementService classementService;

    @GetMapping()
    public ResponseEntity<List<ClientDTO>> getClientsWithClassements() {
        return ResponseEntity.ok(classementService.getClientsWithClassements());
    }

}
