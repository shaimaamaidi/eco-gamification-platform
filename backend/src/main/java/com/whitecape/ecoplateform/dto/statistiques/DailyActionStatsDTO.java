package com.whitecape.ecoplateform.dto.statistiques;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyActionStatsDTO {
    private LocalDate date;
    private String type;
    private String status;
    private long count;
}
