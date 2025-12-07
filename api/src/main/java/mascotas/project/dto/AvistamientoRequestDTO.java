package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvistamientoRequestDTO {

    @Schema(description = "usuario que avista", type = "long", example = "1", required = true)
    private Long usuarioId;
    @Schema(description = "id de extravio", type = "long", example = "40", required = true)
    private Long extravioId;
    @Schema(description = "zona descriptiva", type = "string", example = "zona del parque nacional", required = false)
    private String zona;
    @Schema(description = "comentario descriptivo", type = "string", example = "cerca del cartel de entrada", required = false)
    private String comentario;

    @Schema(type = "string", example = "22-11-2025 20:15:10")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;

    //datos geolocalizacion
    @Schema(description = "datos de geolocalizacion", type = "double", example = "-54.8019")
    private Double latitud;
    @Schema(description = "datos de geolocalizacion", type = "double", example = "-68.3030")
    private Double longitud;


}