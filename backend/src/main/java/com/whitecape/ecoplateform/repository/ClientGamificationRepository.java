package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.ClientGamification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface ClientGamificationRepository extends JpaRepository<ClientGamification, Long>  {
    @Query("""
    SELECT cg\s
    FROM ClientGamification cg\s
    WHERE cg.gamification.id = :gamificationId\s
    AND cg.client.id = :clientId\s
    """)
    Optional<ClientGamification> findByGamificationIdAndClientId(@Param("gamificationId") Long gamificationId, @Param("clientId") Long clientId);

}
