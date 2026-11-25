package com.whitecape.ecoplateform.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private String message;

    private boolean isRead;

    private LocalDateTime time;
}
