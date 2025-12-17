package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PosibleTutorRequest {

    @Schema(description = "usuario que se declara como PosibleTutor", example = "1")
    private Long usuarioId;
    @Schema(description = "extravio ID", example = "1")
    private Long extravioId;
    private String observacion;

    @Schema(type = "string", example = "22-11-2025 20:15:10")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;
}
