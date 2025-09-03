package mascotas.project.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ExtravioDetailDTO {

    private Long mascotaId;
    private String nombreMascota;
    private String zona;
    private LocalDateTime hora;
    private String observacion;
    private Boolean atencionMedica;
    private Boolean resuelto;
}
