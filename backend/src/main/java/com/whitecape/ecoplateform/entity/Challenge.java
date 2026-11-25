package com.whitecape.ecoplateform.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.whitecape.ecoplateform.enums.ActionType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@DiscriminatorValue("CHALLENGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Challenge extends Gamification {

    @Enumerated(EnumType.STRING)
    @Column(name="action",nullable = false)
    private ActionType action;

    @Column(name="startDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @Column(name="endDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
}

