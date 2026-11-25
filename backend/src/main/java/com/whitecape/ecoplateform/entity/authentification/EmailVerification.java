package com.whitecape.ecoplateform.entity.authentification;

import com.whitecape.ecoplateform.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer verificationCode;

    private LocalDateTime verificationCodeExpiresAt;

    @OneToOne
    @JoinColumn(name = "id_user")
    private User user;
}
