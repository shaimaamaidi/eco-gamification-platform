package com.whitecape.ecoplateform.mapper;

import com.whitecape.ecoplateform.dto.AdminDTO;
import com.whitecape.ecoplateform.entity.Admin;

public class AdminMapper {
    public static Admin toEntity(AdminDTO adminDTO){
        Admin admin=new Admin();
        admin.setId(adminDTO.getId());
        admin.setDisplayName(adminDTO.getUserName());
        admin.setMail(adminDTO.getMail());
        admin.setPassword(adminDTO.getPassword());
        return admin;
    }
    public static AdminDTO toDTO(Admin admin) {
        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setId(admin.getId());
        adminDTO.setUserName(admin.getDisplayName());
        adminDTO.setMail(admin.getMail());
        return adminDTO;
    }
}
