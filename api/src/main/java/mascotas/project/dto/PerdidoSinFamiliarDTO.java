package mascotas.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class PerdidoSinFamiliarDTO {

    @NotNull
    private ExtravioRequestDTO datosExtravio;
    @NotNull
    private MascotaDTORequest datosMascota;
}
