package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PosibleTutorDetail {

    private Long id;
    private UsuarioDTO posibleTutor;
    private Long extravioId;
    private String observacion;

    @Schema(type = "string", example = "23-09-2025")
    @JsonFormat(pattern="dd-MM-yyyy")
    private LocalDate hora;
}
