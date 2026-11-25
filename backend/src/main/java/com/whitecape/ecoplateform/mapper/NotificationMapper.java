package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.NotificationDTO;
import com.whitecape.ecoplateform.entity.Notification.AdminNotification;
import com.whitecape.ecoplateform.entity.Notification.ClientNotification;

public class NotificationMapper {
    public static NotificationDTO toNotificationDTO(AdminNotification notif){
        NotificationDTO notificationDTO=new NotificationDTO();
        notificationDTO.setMessage(notif.getMessage());
        notificationDTO.setRead(notif.isRead());
        notificationDTO.setTime(notif.getCreatedAt());
        return notificationDTO;
    }

    public static NotificationDTO toNotificationDTO(ClientNotification notif){
        NotificationDTO notificationDTO=new NotificationDTO();
        notificationDTO.setMessage(notif.getMessage());
        notificationDTO.setRead(notif.isRead());
        notificationDTO.setTime(notif.getCreatedAt());
        return notificationDTO;
    }
}
