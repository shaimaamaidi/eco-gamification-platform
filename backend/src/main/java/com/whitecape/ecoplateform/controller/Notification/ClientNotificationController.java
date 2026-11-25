package com.whitecape.ecoplateform.controller.Notification;

import com.whitecape.ecoplateform.dto.NotificationDTO;
import com.whitecape.ecoplateform.service.Notification.ClientNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class ClientNotificationController {
    @Autowired
    private ClientNotificationService clientNotificationService;

    @GetMapping("/{clientId}")
    public List<NotificationDTO> getAll(@PathVariable Long clientId) {
        return clientNotificationService.getNotificationsForClient(clientId);
    }

    @PostMapping("/{clientId}/markAllRead")
    public void markAllRead(@PathVariable Long clientId) {
        clientNotificationService.markAllAsRead(clientId);
    }
}
