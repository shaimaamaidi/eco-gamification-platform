package com.whitecape.ecoplateform.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("BADGE")
public class Badge extends Gamification {
}
