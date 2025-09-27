package mascotas.project.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({Exception.class})
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {

        log.info("Global_Exception_Handler: Handling Unexpected Exception");

        ErrorResponse errorBody = ErrorResponse.builder()
                                               .error(HttpStatus.INTERNAL_SERVER_ERROR.name())
                                               .message("Unexpected Error occurred, detail: " + ex.toString())
                                               .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                               .requestTime(Instant.now())
                                               .path(this.buildPathWithQueryParams(request))
                                               .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
    }

    @ExceptionHandler({ResourceNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {

        log.info("Global_Exception_Handler: Handling ResourceNotFoundException");
        ErrorResponse errorBody = ErrorResponse.builder()
                                                .error(HttpStatus.NOT_FOUND.name())
                                                .message("Resource Not Found")
                                                .status(HttpStatus.NOT_FOUND.value())
                                                .requestTime(Instant.now())
                                                .path(this.buildPathWithQueryParams(request))
                                                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
    }

    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex, HttpServletRequest request) {

        log.info("Global_Exception_Handler: Handling NotFoundException");
        ErrorResponse errorBody = ErrorResponse.builder()
                .error(HttpStatus.NOT_FOUND.name())
                .message(ex.getMessage())
                .status(HttpStatus.NOT_FOUND.value())
                .requestTime(Instant.now())
                .path(this.buildPathWithQueryParams(request))
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
    }

    @ExceptionHandler({BadRequestException.class})
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex, HttpServletRequest request) {

        log.info("Global_Exception_Handler: Handling BadRequestException");
        ErrorResponse errorBody = ErrorResponse.builder()
                .error(HttpStatus.BAD_REQUEST.name())
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .requestTime(Instant.now())
                .path(this.buildPathWithQueryParams(request))
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
    }

    @ExceptionHandler({NoContentException.class})
    public ResponseEntity<ErrorResponse> handleNoContentException(NoContentException ex, HttpServletRequest request) {

        log.info("Global_Exception_Handler: Handling NoContentException");

        ErrorResponse errorBody = ErrorResponse.builder()
                .error(HttpStatus.NO_CONTENT.name())
                .message(ex.getMessage())
                .status(HttpStatus.NO_CONTENT.value())
                .requestTime(Instant.now())
                .path(this.buildPathWithQueryParams(request))
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleInvalidFormat(HttpMessageNotReadableException ex,  HttpServletRequest request) {

        if ( ex.getCause() instanceof InvalidFormatException invalidFormatEx) {


            log.info("Global_Exception_Handler: Handling InvalidFormatException");

            ErrorResponse errorBody = ErrorResponse.builder()
                    .error(HttpStatus.BAD_REQUEST.name())
                    .message(ErrorsEnums.INVALID_ENUM_CONTENT_ERROR.getDescription() + invalidFormatEx.getValue())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .requestTime(Instant.now())
                    .path(this.buildPathWithQueryParams(request))
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }else return null;
    }

    private String buildPathWithQueryParams(HttpServletRequest request) {

        StringBuilder path = new StringBuilder();
        path.append( request.getRequestURI() ).append( request.getQueryString() != null ? ("?" + request.getQueryString()) : "" );

        return path.toString();
    }

}
