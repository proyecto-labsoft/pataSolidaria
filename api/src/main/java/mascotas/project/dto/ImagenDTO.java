package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImagenDTO {
    
    private Long id;
    private String nombreArchivo;
    private String rutaStorage;
    private String urlPublica;
    private String tipoMime;
    private Long tamanio;
    
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime fechaSubida;
    
    private Integer orden;
}
