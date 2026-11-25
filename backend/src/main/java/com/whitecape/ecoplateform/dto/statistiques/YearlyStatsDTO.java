package com.whitecape.ecoplateform.dto.statistiques;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YearlyStatsDTO {
    private int year;
    private long count;
}
