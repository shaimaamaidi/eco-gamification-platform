package com.whitecape.ecoplateform.dto;

import lombok.Data;

@Data
public class RecompenseDTO {
    private Long id;
    private String name;
    private String description;
    private int requiredBadges;
    private String icon;
    private String extension;
    private double progress;
}
