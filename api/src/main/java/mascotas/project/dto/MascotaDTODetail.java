package mascotas.project.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import mascotas.project.Enums.SexoEnum;
import mascotas.project.Enums.TamanioEnum;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class MascotaDTODetail {

    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private String color;
    private String descripcion;
    private Boolean esterilizado;
    private Boolean chipeado;

    @Schema(description = "Sexo de la mascota", example = "M", allowableValues = {"M", "H"})
    private SexoEnum sexo;

    @Schema(description = "Tamaño de la mascota", example = "MEDIANO", allowableValues = {"PEQUENIO", "MEDIANO", "GRANDE", "GIGANTE"})
    private TamanioEnum tamanio;

    @Schema(type = "string", example = "23-09-2025")
    @JsonFormat(pattern="dd-MM-yyyy")
    private LocalDate fechaNacimiento;
}
