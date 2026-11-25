package com.whitecape.ecoplateform.entity.Notification;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.whitecape.ecoplateform.entity.Client;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ClientNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_client", nullable = false)
    @JsonBackReference
    private Client client;

    private String message;

    private boolean isRead;

    private LocalDateTime createdAt = LocalDateTime.now();
}
