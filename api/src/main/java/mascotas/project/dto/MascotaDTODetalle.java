package mascotas.project.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class MascotaDTODetalle {

    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private Character sexo;
    private String color;
    private String descripcion;
    @JsonFormat(pattern="dd-MM-yyyy")
    private LocalDate fechaNacimiento;
    private Boolean esterilizado;
    private Boolean chipeado;
}
