package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ExtravioRequestDTO {

    @Schema(type = "long", example = "10")
    private Long mascotaId;
    @Schema(type = "long", example = "2")
    private Long creador;
    @Schema(type = "string", example = "zona del parque")
    private String zona;
    @Schema(type = "string", example = "tenia un collar rojo")
    private String observacion;
    @Schema(type = "string", example = "23-01-2025 20:15:10")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;
    @Schema(type = "boolean", example = "false")
    private Boolean resuelto;
    @Schema(type = "double", example = "-54.8019")
    private Double latitud;
    @Schema(type = "double", example = "-68.3030")
    private Double longitud;
    @Schema(type = "string", example = "calle falsa 123")
    private String direccion;
}
