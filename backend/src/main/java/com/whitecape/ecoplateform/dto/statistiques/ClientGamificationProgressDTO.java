package com.whitecape.ecoplateform.dto.statistiques;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientGamificationProgressDTO {
    private String username;
    private Double pourcentage;
    private String status;
}
