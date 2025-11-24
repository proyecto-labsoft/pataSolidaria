package mascotas.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PerdidoSinFamiliarDTO {

    @NotNull
    private ExtravioRequestDTO datosExtravio;
    @NotNull
    private MascotaDTORequest datosMascota;
}
