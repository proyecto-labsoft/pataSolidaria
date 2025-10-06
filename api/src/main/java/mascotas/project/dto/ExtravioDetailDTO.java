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

    private Long creadorId;
    private Long mascotaId;
    private String zona;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;
    private String observacion;
    private Boolean resuelto;

    private MascotaDTODetail mascotaDetalle;
}
