package com.whitecape.ecoplateform.service.Authentication;

import com.whitecape.ecoplateform.entity.User;
import com.whitecape.ecoplateform.entity.authentification.Token;
import com.whitecape.ecoplateform.enums.TokenType;
import com.whitecape.ecoplateform.repository.authentification.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenRepository tokenRepository;

    public void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }
    public void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
    public Token getByToken(String token){
        return tokenRepository.findByToken(token).orElse(null);
    }
    public void deleTokenByClient(Long id){
        var validUserTokens = tokenRepository.findAllByUser(id);
        if (validUserTokens.isEmpty())
            return;
        tokenRepository.deleteAll(validUserTokens);
    }
}
