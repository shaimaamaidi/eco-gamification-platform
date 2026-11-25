package com.whitecape.ecoplateform.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@DiscriminatorValue("CLIENT")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Client extends User {

    @Column(name="total_points")
    private int totalPoints;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Action> actions = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("client-classements")
    private List<Classement> classements= new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "client_recompenses",joinColumns = @JoinColumn(name = "id_client"), inverseJoinColumns = @JoinColumn(name = "id_recompense"))
    private List<Recompense> recompenses = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("client-clientGamifications")
    private List<ClientGamification> gamifications = new ArrayList<>();

}
