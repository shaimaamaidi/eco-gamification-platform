package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.Action;
import com.whitecape.ecoplateform.enums.ActionStatus;
import com.whitecape.ecoplateform.enums.ActionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ActionRepository extends JpaRepository<Action, Long> {
    List<Action> findByTypeAndStatus(ActionType type, ActionStatus status);
    @Query("SELECT a.createdAt as day,a.type, a.status, COUNT(a) as total " +
            "FROM Action a " +
            "GROUP BY a.createdAt, a.type, a.status " +
            "ORDER BY a.createdAt")
    List<Object[]> countActionsGroupedByDayAndTypeAndStatus();

    // nbre des clients actifs entre deux dates
    @Query("SELECT COUNT(DISTINCT a.client.id) " +
            "FROM Action a " +
            "WHERE a.createdAt BETWEEN :startDate AND :endDate")
    Long countDistinctClientsByCreatedAtBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
