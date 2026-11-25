package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.ClassementDTO;
import com.whitecape.ecoplateform.entity.Classement;

public class ClassementMapper {
    public static ClassementDTO toDTO(Classement classement){
        ClassementDTO classementDTO=new ClassementDTO();
        classementDTO.setPosition(classement.getPosition());
        classementDTO.setTotalPoints(classement.getTotalPoints());
        classementDTO.setType(classement.getType().name());
        if(classement.getActionType()!=null)
            classementDTO.setActionType(classement.getActionType().toString());
        else
            classementDTO.setActionType("");
        if(classement.getCity()!=null)
            classementDTO.setCity(classement.getCity());
        else
            classementDTO.setCity("");
        return  classementDTO;
    }
}
