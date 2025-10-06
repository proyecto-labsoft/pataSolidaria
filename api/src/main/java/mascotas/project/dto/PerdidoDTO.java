package mascotas.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PerdidoDTO {

    @Schema(description = "Id del extravio si existe", example = "1")
    private Long extravioId;
    @Schema(description = "Valor para indicar si existe extravio activo", example = "true")
    private Boolean estaExtraviado;
}
