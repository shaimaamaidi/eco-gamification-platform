package com.whitecape.ecoplateform.dto.statistiques;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassementStatsDTO {
    private String username;
    private int position;
    private int totalPoints;
    private String type;
    private String actionType;
    private String city;
}
