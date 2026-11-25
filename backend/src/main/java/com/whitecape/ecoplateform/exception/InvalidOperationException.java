package com.whitecape.ecoplateform.exception;

import lombok.Getter;

@Getter
public class InvalidOperationException extends RuntimeException {

  private ErrorCodes errorCode;

  public InvalidOperationException(String message, ErrorCodes errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}
