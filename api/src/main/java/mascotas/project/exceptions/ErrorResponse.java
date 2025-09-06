package mascotas.project.exceptions;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss", timezone = "America/BuenosAires")
    private Instant requestTime;
    private String path;
}
