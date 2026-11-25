package com.whitecape.ecoplateform.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.whitecape.ecoplateform.enums.ActionStatus;
import com.whitecape.ecoplateform.enums.ActionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"client"})
public class Action {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_action")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name="type",nullable = false)
    private ActionType type;

    @Column(name="createdAt",nullable = false)
    private LocalDate createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false)
    private ActionStatus status;

    @Column(name = "award_points")
    private int awardPoints;

    @Lob
    @Column(name = "image",nullable = false)
    private String image;

    @ManyToOne
    @JoinColumn(name = "id_client", nullable = false)
    @JsonBackReference
    private Client client;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_feedback")
    private Feedback feedback;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
    }

}
