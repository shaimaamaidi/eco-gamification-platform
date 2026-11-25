package com.whitecape.ecoplateform.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ClientDTO {
    private Long id;
    private String userName;
    private String mail;
    private String city ;
    private int totalPoints;
    private String password;
    private List<ClassementDTO> classement= new ArrayList<>();
}
