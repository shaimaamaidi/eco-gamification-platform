package com.whitecape.ecoplateform.dto;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private String mail;
    private String password;
}
