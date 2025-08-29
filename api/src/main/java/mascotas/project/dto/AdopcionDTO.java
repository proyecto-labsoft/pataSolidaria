package mascotas.project.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class AdopcionDTO {

    private Long publicador;
    private Long mascotaId;
    private String requisitos;
    private Boolean transito;
}
