package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    boolean existsByTitle(String Title);
}
