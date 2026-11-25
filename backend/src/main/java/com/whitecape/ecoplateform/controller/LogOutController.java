package com.whitecape.ecoplateform.controller;

import com.whitecape.ecoplateform.service.Authentication.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/logout")
public class LogOutController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping
    public void logOut(HttpServletRequest request) {
        authenticationService.logOut(request);
    }
}
