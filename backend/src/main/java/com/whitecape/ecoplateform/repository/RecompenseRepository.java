package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.Recompense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecompenseRepository  extends JpaRepository<Recompense, Long>  {
    boolean existsByName(String name);
}
