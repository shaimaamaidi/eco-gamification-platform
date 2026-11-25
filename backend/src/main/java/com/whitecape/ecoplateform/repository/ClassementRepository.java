package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.Classement;
import com.whitecape.ecoplateform.enums.ActionType;
import com.whitecape.ecoplateform.enums.ClassementType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClassementRepository extends JpaRepository<Classement, Long> {

    Optional<Classement> findByClientIdAndType(Long clientId, ClassementType type);
    List<Classement> findByType(ClassementType type);
    List<Classement> findByTypeAndCity(ClassementType type, String city);
    List<Classement> findByTypeAndActionType(ClassementType type, ActionType actionType);
    Optional<Classement> findByClientIdAndTypeAndActionType(Long clientId,ClassementType type, ActionType actionType);


}
