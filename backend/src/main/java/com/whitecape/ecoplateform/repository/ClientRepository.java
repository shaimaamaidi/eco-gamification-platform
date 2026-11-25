package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.Client;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCity (String city);
    //nbre des clients ayant une date de création spécifique
    @Query("SELECT COUNT(c) FROM Client c WHERE c.createdAt <= :date")
    Long countClientsByCreatedAtDate(@Param("date") LocalDate date);

    //nbre des clients vérifiés ayant une date de création spécifique
    @Query("SELECT COUNT(c) FROM Client c WHERE c.createdAt <= :date AND c.enabled = true")
    Long countEnabledClientsByCreatedAtDate(@Param("date") LocalDate date);


    //pour un courbe cumulative des clients
    @Query("SELECT c.createdAt AS date, COUNT(c.id) FROM Client c GROUP BY c.createdAt ORDER BY date ")
    List<Object[]> countClientsByCreationDatePerDay();
}
