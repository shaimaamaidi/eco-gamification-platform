package com.whitecape.ecoplateform.repository.Notification;

import com.whitecape.ecoplateform.entity.Notification.AdminNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminNotificationRepository extends JpaRepository<AdminNotification, Long> {
    List<AdminNotification> findAllByOrderByCreatedAtDesc();
}
