package com.whitecape.ecoplateform.dto;

import lombok.Data;

@Data
public class BadgeDTO {
    private Long id;
    private String title;
    private String description;
    private int goal;
    private String  icon;
    private String extension;
    private double progress;
}
