package com.whitecape.ecoplateform.enums;

import lombok.Getter;

@Getter
public enum ActionType {
    TRI(10),
    RECYCLAGE(15),
    COMPOSTAGE(45),
    PLANTATION(40),
    NETTOYAGE(30);
    private final int points;

    ActionType(int points) {
        this.points = points;
    }
}
