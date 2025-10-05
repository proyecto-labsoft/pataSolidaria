package mascotas.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AdopcionDetailDTO {

    private Long publicadorID;
    private String publicadorNombre;
    private Integer publicadorContacto;
    private String requisitos;
    private Boolean transito;
    private MascotaDTODetail mascotaDetalle;
}
