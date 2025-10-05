package mascotas.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ExtravioRequestDTO {

    private Long creador;
    private Long mascotaId;
    private String zona;
    private LocalDateTime hora;
    private String observacion;
    private Boolean atencionMedica;
    
    @NotNull
    private Double latitud;
    
    @NotNull
    private Double longitud;
    
    private String direccion;

    /*private LocalDate tiempoGracia;
    private Boolean atencionMedica;*/
}
