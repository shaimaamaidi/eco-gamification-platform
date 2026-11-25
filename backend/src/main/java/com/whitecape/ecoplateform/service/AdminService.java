package com.whitecape.ecoplateform.service;

import com.whitecape.ecoplateform.dto.AdminDTO;
import com.whitecape.ecoplateform.entity.Admin;
import com.whitecape.ecoplateform.exception.EntityNotFoundException;
import com.whitecape.ecoplateform.exception.ErrorCodes;
import com.whitecape.ecoplateform.exception.InvalidOperationException;
import com.whitecape.ecoplateform.mapper.AdminMapper;
import com.whitecape.ecoplateform.repository.AdminRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;
    @Transactional
    public Admin addAdmin(Admin admin){
        List<Admin> admins=adminRepository.findAll();
        if (admins.isEmpty()){ //accepter existence d'un seul admin
            return adminRepository.save(admin);
        }else {
            throw new InvalidOperationException(
                    "Un administrateur existe déjà." ,
                    ErrorCodes.ADMIN_ALREADY_EXISTS);
        }
    }
    public AdminDTO getAdmin(Long id) {
        return adminRepository.findById(id)
                .map(AdminMapper::toDTO)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Aucun administrateur trouvé avec l'identifiant : " + id,
                                ErrorCodes.ADMIN_NOT_FOUND
                        )
                );
    }
}
