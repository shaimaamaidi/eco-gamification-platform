package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.dto.AdminDTO;
import com.whitecape.ecoplateform.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getAdminInformation(@PathVariable Long id) {
        AdminDTO admin = adminService.getAdmin(id);
        return ResponseEntity.ok(admin);
    }
}
