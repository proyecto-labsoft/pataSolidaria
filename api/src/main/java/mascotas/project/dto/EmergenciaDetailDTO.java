package mascotas.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Builder
@Data
public class EmergenciaDetailDTO {

    private UsuarioDTO usuarioCreador;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;
    private String zona;
    private String observacion;
    private Double latitud;
    private Double longitud;
    private Boolean atendido;


}
