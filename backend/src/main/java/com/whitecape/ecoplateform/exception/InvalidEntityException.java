package com.whitecape.ecoplateform.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class InvalidEntityException extends RuntimeException {

  private ErrorCodes errorCode;

  public InvalidEntityException(String message, ErrorCodes errorCode) {
    super(message);
    this.errorCode = errorCode;
  }

}
