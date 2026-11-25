package com.whitecape.ecoplateform.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.whitecape.ecoplateform.enums.ActionType;
import com.whitecape.ecoplateform.enums.ClassementType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"client"})
public class Classement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_classement")
    private Long id;

    @Column(name = "position")
    private int position;

    @Column(name = "total_points", nullable = false)
    private int totalPoints;

    @Enumerated(EnumType.STRING)
    @Column(name="type",nullable = false)
    private ClassementType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type")
    private ActionType actionType;

    @Column(name = "city")
    private String city;

    @ManyToOne
    @JoinColumn(name = "id_client", nullable = false)
    @JsonBackReference("client-classements")
    private Client client;
}