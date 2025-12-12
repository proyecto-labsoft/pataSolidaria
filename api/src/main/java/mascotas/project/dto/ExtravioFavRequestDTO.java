package mascotas.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ExtravioFavRequestDTO {

    @Schema(type = "long", example = "1", nullable = false)
    public Long usuarioId;
    @Schema(type = "long", example = "10", nullable = false)
    public Long extravioId;
}
