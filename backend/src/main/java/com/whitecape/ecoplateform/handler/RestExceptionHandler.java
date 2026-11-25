package com.whitecape.ecoplateform.handler;

import com.whitecape.ecoplateform.exception.*;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;

@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

  private HttpHeaders jsonHeaders() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    return headers;
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErrorDto> handleEntityNotFound(EntityNotFoundException ex, WebRequest request) {
    ErrorDto errorDto = ErrorDto.builder()
            .code(ex.getErrorCode())
            .httpCode(HttpStatus.NOT_FOUND.value())
            .message(ex.getMessage())
            .build();
    return new ResponseEntity<>(errorDto, jsonHeaders(), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(InvalidOperationException.class)
  public ResponseEntity<ErrorDto> handleInvalidOperation(InvalidOperationException ex, WebRequest request) {
    ErrorDto errorDto = ErrorDto.builder()
            .code(ex.getErrorCode())
            .httpCode(HttpStatus.CONFLICT.value())
            .message(ex.getMessage())
            .build();
    return new ResponseEntity<>(errorDto, jsonHeaders(), HttpStatus.CONFLICT);
  }

  @ExceptionHandler(InvalidEntityException.class)
  public ResponseEntity<ErrorDto> handleInvalidEntity(InvalidEntityException ex, WebRequest request) {
    ErrorDto errorDto = ErrorDto.builder()
            .code(ex.getErrorCode())
            .httpCode(HttpStatus.BAD_REQUEST.value())
            .message(ex.getMessage())
            .build();
    return new ResponseEntity<>(errorDto, jsonHeaders(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler({RuntimeException.class, IOException.class, MessagingException.class})
  public ResponseEntity<ErrorDto> handleUnexpectedException(Exception ex, WebRequest request) {
    ErrorDto errorDto = ErrorDto.builder()
            .code(ErrorCodes.INTERNAL_ERROR)
            .httpCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .message(ex.getMessage())
            .build();
    return new ResponseEntity<>(errorDto, jsonHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorDto> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
    ErrorDto errorDto = ErrorDto.builder()
            .code(ErrorCodes.BAD_CREDENTIALS)
            .httpCode(HttpStatus.UNAUTHORIZED.value())
            .message("Identifiants incorrects.")
            .build();
    return new ResponseEntity<>(errorDto, jsonHeaders(), HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler({ForbiddenException.class, UsernameNotFoundException.class, InternalAuthenticationServiceException.class})
  public ResponseEntity<ErrorDto> handleAuthExceptions(Exception ex, WebRequest request) {
    String message;
    if (ex instanceof ForbiddenException) {
      message = ex.getMessage();
    } else if (ex instanceof UsernameNotFoundException) {
      message = "Adresse email introuvable.";
    } else if (ex instanceof InternalAuthenticationServiceException) {
      message = "Erreur d’authentification. Vérifiez vos identifiants.";
    } else {
      message = "Mot de passe incorrect.";
    }

    ErrorDto errorDto = ErrorDto.builder()
            .code(ErrorCodes.BAD_CREDENTIALS)
            .httpCode(HttpStatus.FORBIDDEN.value())
            .message(message)
            .build();
    return new ResponseEntity<>(errorDto, jsonHeaders(), HttpStatus.FORBIDDEN);
  }

}
