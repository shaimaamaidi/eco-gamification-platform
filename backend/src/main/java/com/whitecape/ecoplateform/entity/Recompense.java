package com.whitecape.ecoplateform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"clients"})
public class Recompense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_recompense")
    private Long id;

    @Column(name="name",nullable = false,unique = true)
    private String name;

    @Column(name="description",length = 1000)
    private String description;

    @Column(name = "required_badges",nullable = false)
    private int requiredBadges;

    @Column(name="icon",nullable = false)
    private String icon;

    @ManyToMany(mappedBy = "recompenses")
    private List<Client> clients = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Recompense)) return false;
        Recompense that = (Recompense) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
