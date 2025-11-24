package mascotas.project.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AdopcionDTO {

    private Long publicadorID;
    private String publicadorNombre;
    private Integer publicadorContacto;
    private Long mascotaID;
    private String nombreCompaniero;
    private String requisitos;
    private Boolean transito;
    private Boolean esterilizado;
}
