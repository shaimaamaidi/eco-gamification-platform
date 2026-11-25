package com.whitecape.ecoplateform.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.whitecape.ecoplateform.enums.GamificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"client"})
public class ClientGamification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_client_gamification")
    private Long id;

    @ManyToOne
    @JoinColumn(name="id_client", nullable = false)
    @JsonBackReference("client-clientGamifications")
    private Client client;

    @ManyToOne
    @JoinColumn(name="id_gamification", nullable = false)
    @JsonBackReference("gamification-clientGamifications")
    private Gamification gamification;

    @Column(name="pourcentage",nullable = false)
    private double pourcentage;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false)
    private GamificationStatus status;
}

