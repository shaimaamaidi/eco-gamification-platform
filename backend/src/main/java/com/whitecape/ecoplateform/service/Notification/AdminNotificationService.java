package com.whitecape.ecoplateform.service.Notification;

import com.whitecape.ecoplateform.dto.NotificationDTO;
import com.whitecape.ecoplateform.entity.Notification.AdminNotification;
import com.whitecape.ecoplateform.mapper.NotificationMapper;
import com.whitecape.ecoplateform.repository.Notification.AdminNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminNotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final AdminNotificationRepository adminNotificationRepository;

    public void notifyAdmin(String message) {
        AdminNotification notif = new AdminNotification();
        notif.setMessage(message);
        notif.setRead(false);
        adminNotificationRepository.save(notif);
        messagingTemplate.convertAndSend("/topic/admin", Map.of(
                "message", message,
                "time", LocalDateTime.now().toString()
        ));
    }

    public List<NotificationDTO> getNotifications() {
        return adminNotificationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(NotificationMapper::toNotificationDTO)
                .toList();
    }
    public void markAllAsRead() {
        List<AdminNotification> notifs = adminNotificationRepository.findAllByOrderByCreatedAtDesc();
        for (AdminNotification n : notifs) {
            n.setRead(true);
        }
        adminNotificationRepository.saveAll(notifs);
    }
}

