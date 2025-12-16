package mascotas.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class EmergenciaAnimalAnonimoDTO {

    @NotNull
    private EmergenciaRequestDTO datosEmergencia;
    @NotNull
    private MascotaDTORequest datosMascota;
}
