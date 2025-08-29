package mascotas.project.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class UsuarioDTO {

    private Integer id;
    private String nombre;
    private Integer celular;
    private String email;
    private String direccion;
    private Boolean administrador;
}
