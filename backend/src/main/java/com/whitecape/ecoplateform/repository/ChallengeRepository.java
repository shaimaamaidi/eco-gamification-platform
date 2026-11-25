package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    boolean existsByTitle(String Title);
    List<Challenge> findByEndDateBefore(LocalDate today);
    List<Challenge> findByEndDateAfter(LocalDate today);
}
