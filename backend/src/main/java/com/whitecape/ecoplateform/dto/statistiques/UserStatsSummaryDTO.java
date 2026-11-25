package com.whitecape.ecoplateform.dto.statistiques;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsSummaryDTO {
    private int badgesLocked;
    private int challengesCompleted;
    private int recompensesAchieved;
}
