package mascotas.project.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertFalse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class EmergenciaRequestDTO {

    @Schema(description = "usuario que avista", type = "long", example = "1", required = true)
    private Long usuarioId;

    @Schema(description = "zona descriptiva", type = "string", example = "zona del parque nacional", required = false)
    private String zona;

    @Schema(description = "comentario descriptivo", type = "string", example = "cerca del cartel de entrada", required = false)
    private String observacion;

    @Schema(type = "string", example = "22-11-2025 20:15:10")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;

    @Schema(description = "estado de la emergenia", type = "bool", example = "false" )
    private Boolean atendido;

    //datos geolocalizacion
    @Schema(description = "datos de geolocalizacion", type = "double", example = "-54.8019")
    private Double latitud;
    @Schema(description = "datos de geolocalizacion", type = "double", example = "-68.3030")
    private Double longitud;


}
