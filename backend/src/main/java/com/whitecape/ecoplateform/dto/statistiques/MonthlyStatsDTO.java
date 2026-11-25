package com.whitecape.ecoplateform.dto.statistiques;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyStatsDTO {
        private int year;
        private int month;
        private long count;
}
