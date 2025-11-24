package mascotas.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AdopcionRequestDTO {

    @Schema(description ="id del publicador de la adopcion", example = "1", type = "long", nullable = false)
    private Long publicadorID;

    @Schema(description ="id de la mascota en adopcion", example = "1", type = "long", nullable = false)
    private Long mascotaID;

    @Schema(description ="requisitos de la adopcion", example = "necesita un patio amplio", type = "string", nullable = true)
    private String requisitos;

    @Schema(description ="si es transito o no", allowableValues = {"True", "False"}, type = "bool", nullable = false)
    private Boolean transito;

}
