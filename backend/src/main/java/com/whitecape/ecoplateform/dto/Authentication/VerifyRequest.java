package com.whitecape.ecoplateform.dto.Authentication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyRequest {
    private String mail;
    private int verificationCode;
}
