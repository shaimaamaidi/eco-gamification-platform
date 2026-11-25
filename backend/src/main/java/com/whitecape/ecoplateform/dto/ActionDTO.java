package com.whitecape.ecoplateform.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ActionDTO {
    private Long id;
    private Long idClient;
    private String mailClient;
    private String type;
    private String image;
    private String extension;
    private LocalDate date;
    private String status;
    private int awardPoints;
    private String feedback;
}
