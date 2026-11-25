package com.whitecape.ecoplateform.controller.Notification;

import com.whitecape.ecoplateform.dto.NotificationDTO;
import com.whitecape.ecoplateform.service.Notification.AdminNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {
    @Autowired
    private AdminNotificationService adminNotificationService;
    @GetMapping
    public List<NotificationDTO> getAllNotifications() {
        return adminNotificationService.getNotifications();
    }

    @PostMapping("/markAllRead")
    public void markAllRead() {
        adminNotificationService.markAllAsRead();
    }
}
