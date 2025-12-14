package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ExtravioDetailDTO {

    private Long extravioId;
    private Long creadorId;
    private Long mascotaId;
    private String zona;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime ultimoAvistamiento;
    private String observacion;
    private Boolean resuelto;
    private Boolean creadoByFamiliar;
    private MascotaDTODetail mascotaDetalle;
    private Double latitud;
    private Double longitud;
    private String direccion;
}
