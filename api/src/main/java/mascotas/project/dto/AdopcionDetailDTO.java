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

    private UsuarioDTO publicador;
    private String requisitos;
    private Boolean transito;
    private MascotaDTODetail mascotaDetalle;
}
