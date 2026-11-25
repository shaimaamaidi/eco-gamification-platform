package com.whitecape.ecoplateform.dto;

import lombok.Data;

@Data
public class ClassementDTO {
    private int position;
    private int totalPoints;
    private String type;
    private String actionType;
    private String city;
}
