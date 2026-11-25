package com.whitecape.ecoplateform.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "gamification_type", discriminatorType = DiscriminatorType.STRING)
@Table(
        name = "gamification",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"gamification_type", "title"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Gamification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_gamification")
    private Long id;

    @Column(name="title",nullable = false)
    private String title;

    @Column(name="description",length = 1000)
    private String description;

    @Column(name="goal",nullable = false)
    private int goal;//pour un défis c'est le nombre d'actions par action,pour un badge c'est le nombre total des points

    @Column(name="icon",nullable = false)
    private String icon;

    @OneToMany(mappedBy = "gamification", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("gamification-clientGamifications")
    private List<ClientGamification> clientGamifications = new ArrayList<>();

}

