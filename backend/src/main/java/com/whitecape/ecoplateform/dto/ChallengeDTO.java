package com.whitecape.ecoplateform.dto;

import lombok.Data;

@Data
public class ChallengeDTO {
    private Long id;
    private String title;
    private String description;
    private int goal;
    private String actionType;
    private String startDate;
    private String endDate;
    private String icon;
    private String extension;
    private double progress;
}
