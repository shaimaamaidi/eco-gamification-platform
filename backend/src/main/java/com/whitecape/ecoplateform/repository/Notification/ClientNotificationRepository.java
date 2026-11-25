package com.whitecape.ecoplateform.repository.Notification;

import com.whitecape.ecoplateform.entity.Notification.ClientNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClientNotificationRepository extends JpaRepository<ClientNotification, Long> {
    List<ClientNotification> findByClientIdOrderByCreatedAtDesc(Long clientId);
}