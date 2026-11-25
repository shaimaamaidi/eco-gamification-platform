package com.whitecape.ecoplateform.service.Notification;

import com.whitecape.ecoplateform.dto.NotificationDTO;
import com.whitecape.ecoplateform.entity.Client;
import com.whitecape.ecoplateform.entity.Notification.ClientNotification;
import com.whitecape.ecoplateform.mapper.NotificationMapper;
import com.whitecape.ecoplateform.repository.Notification.ClientNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientNotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ClientNotificationRepository clientNotificationRepository;

    public void notifyClient(Client client,String message) {
        ClientNotification notif = new ClientNotification();
        notif.setClient(client);
        notif.setMessage(message);
        notif.setRead(false);
        clientNotificationRepository.save(notif);
        messagingTemplate.convertAndSendToUser(
                client.getId().toString(),
                "/notifications",
                notif
        );
    }

    public List<NotificationDTO> getNotificationsForClient(Long clientId) {
        return clientNotificationRepository.findByClientIdOrderByCreatedAtDesc(clientId)
                .stream()
                .map(NotificationMapper::toNotificationDTO)
                .toList();
    }

    public void markAllAsRead(Long clientId) {
        List<ClientNotification> notifs = clientNotificationRepository.findByClientIdOrderByCreatedAtDesc(clientId);
        for (ClientNotification n : notifs) {
            n.setRead(true);
        }
        clientNotificationRepository.saveAll(notifs);
    }
}
