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
public class MascotaDTORequest {

    private Long familiarId;
    @Schema(description = "nombre de la mascota", example = "Rocky")
    private String nombre;
    @Schema(description = "especie de la mascota", example = "Perro")
    private String especie;
    @Schema(description = "raza de la mascota", example = "Labrador")
    private String raza;
    @Schema(description = "color de la mascota", example = "Marron")
    private String color;
    @Schema(description = "descripcion de la mascota", example = "Perro amigable")
    private String descripcion;
    @Schema(description = "esterilizado", example = "True", allowableValues = {"True", "False"})
    private Boolean esterilizado;
    @Schema(description = "chipeado", example = "True", allowableValues = {"True", "False"})
    private Boolean chipeado;

    @Schema(description = "Sexo de la mascota", example = "M", allowableValues = {"M", "H"})
    private SexoEnum sexo;

    @Schema(description = "Tamaño de la mascota", example = "MEDIANO", allowableValues = {"PEQUENIO", "MEDIANO", "GRANDE", "GIGANTE"})
    private TamanioEnum tamanio;

    @Schema(type = "string", example = "23-09-2025")
    @JsonFormat(pattern="dd-MM-yyyy")
    private LocalDate fechaNacimiento;
}
