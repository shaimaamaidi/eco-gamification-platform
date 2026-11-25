package com.whitecape.ecoplateform.exception;

import org.springframework.security.core.AuthenticationException;

public class ForbiddenException extends AuthenticationException {
    public ForbiddenException(String msg) {
        super(msg);
    }
}
