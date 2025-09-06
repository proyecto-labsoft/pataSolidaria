package mascotas.project.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({Exception.class})
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {

        log.info("Global_Exception_Handler: Handling Generic Exception");

        ErrorResponse errorBody = ErrorResponse.builder()
                                               .error(HttpStatus.INTERNAL_SERVER_ERROR.name())
                                               .message("Generic Error occurred")
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
    public ResponseEntity<ErrorResponse> handleBadNoContentException(NoContentException ex, HttpServletRequest request) {

        log.info("Global_Exception_Handler: Handling NoContentException");

        ErrorResponse errorBody = ErrorResponse.builder()
                .error(HttpStatus.NO_CONTENT.name())
                .message(ex.getMessage())
                .status(HttpStatus.NO_CONTENT.value())
                .requestTime(Instant.now())
                .path(this.buildPathWithQueryParams(request))
                .build();

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(errorBody);
    }

    private String buildPathWithQueryParams(HttpServletRequest request) {

        StringBuilder path = new StringBuilder();
        path.append( request.getRequestURI() ).append( request.getQueryString() != null ? ("?" + request.getQueryString()) : "" );

        return path.toString();
    }

}
