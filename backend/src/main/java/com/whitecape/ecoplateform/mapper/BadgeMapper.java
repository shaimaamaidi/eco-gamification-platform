package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.BadgeDTO;
import com.whitecape.ecoplateform.entity.Badge;
import com.whitecape.ecoplateform.service.ImageService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

public class BadgeMapper {
    public static Badge toEntity(BadgeDTO badgeDTO){
        Badge badge =new Badge();
        badge.setId(badgeDTO.getId());
        badge.setTitle(badgeDTO.getTitle());
        badge.setDescription(badgeDTO.getDescription());
        badge.setGoal(badgeDTO.getGoal());
        return badge ;
    }
    public static BadgeDTO toDTO (Badge badge,double progress){
        BadgeDTO badgeDTO=new BadgeDTO();
        badgeDTO.setId(badge.getId());
        badgeDTO.setTitle(badge.getTitle());
        badgeDTO.setDescription(badge.getDescription());
        badgeDTO.setGoal(badge.getGoal());
        try {
            byte[] imageBytes = Files.readAllBytes(Path.of(badge.getIcon()));
            String base64Icon = Base64.getEncoder().encodeToString(imageBytes);
            badgeDTO.setIcon(base64Icon);
            badgeDTO.setExtension(ImageService.detectExtension(imageBytes));
        } catch (Exception e) {
            badgeDTO.setIcon(null);
        }
        badgeDTO.setProgress(progress);
        return badgeDTO;
    }
}
