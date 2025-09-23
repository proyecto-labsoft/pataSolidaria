package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class PostulacionDTO {

    private Long usuario;
    private Long adopcion;

    @Schema(type = "string", example = "23-09-2025")
    @JsonFormat(pattern="dd-MM-yyyy")
    private LocalDate fecha;
}
