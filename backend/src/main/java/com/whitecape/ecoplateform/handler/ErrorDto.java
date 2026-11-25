package com.whitecape.ecoplateform.handler;

import com.whitecape.ecoplateform.exception.ErrorCodes;
import lombok.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ErrorDto {

  private Integer httpCode;

  private ErrorCodes code;

  private String message;

}
