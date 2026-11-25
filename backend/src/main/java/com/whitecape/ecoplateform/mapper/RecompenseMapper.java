package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.RecompenseDTO;
import com.whitecape.ecoplateform.entity.Recompense;
import com.whitecape.ecoplateform.service.ImageService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

public class RecompenseMapper {
    public static Recompense toEntity(RecompenseDTO recompenseDTO){
        Recompense recompense=new Recompense();
        recompense.setId(recompenseDTO.getId());
        recompense.setName(recompenseDTO.getName());
        recompense.setDescription(recompenseDTO.getDescription());
        recompense.setRequiredBadges(recompenseDTO.getRequiredBadges());
        return recompense;
    }
    public static RecompenseDTO toDTO(Recompense recompense,double progress){
        RecompenseDTO recompenseDTO=new RecompenseDTO();
        recompenseDTO.setId(recompense.getId());
        recompenseDTO.setName(recompense.getName());
        recompenseDTO.setDescription(recompense.getDescription());
        recompenseDTO.setRequiredBadges(recompense.getRequiredBadges());
        try {
            byte[] imageBytes = Files.readAllBytes(Path.of(recompense.getIcon()));
            String base64Icon = Base64.getEncoder().encodeToString(imageBytes);
            recompenseDTO.setIcon(base64Icon);
            recompenseDTO.setExtension(ImageService.detectExtension(imageBytes));
        } catch (Exception e) {
            recompenseDTO.setIcon(null);
        }
        recompenseDTO.setProgress(progress);
        return recompenseDTO;
    }

}
