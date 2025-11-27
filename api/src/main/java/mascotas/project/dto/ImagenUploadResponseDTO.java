package mascotas.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImagenUploadResponseDTO {
    
    private Long imagenId;
    private String urlPublica;
    private String rutaStorage;
    private String mensaje;
}
