package mascotas.project.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class UsuarioDTO {

    private Long id;
    private String nombre;
    private Integer celular;
    private String email;
    private String direccion;
    private Boolean administrador;
}
