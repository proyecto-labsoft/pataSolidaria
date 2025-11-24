package mascotas.project.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import mascotas.project.Enums.SexoEnum;
import mascotas.project.Enums.TamanioEnum;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Data
@Table(name = "companiero", schema = "public")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "companiero_id_seq")
    @SequenceGenerator(name = "companiero_id_seq", sequenceName = "companiero_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(length = 255)
    private String nombre;

    private String especie;

    private String raza;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private SexoEnum sexo;

    @Enumerated(EnumType.STRING)
    @Column(length = 255)
    private TamanioEnum tamanio;

    @Column(nullable = true)
    private String color;

    @Column(name = "descripicon", length = 255)
    private String descripcion;

    @Column(name = "f_naciemiento", nullable = true)
    @JsonFormat(pattern="dd-MM-yyyy")
    private LocalDate fechaNacimiento;

    @Column(nullable = true)
    private Boolean esterilizado;

    @Column(nullable = true)
    private Boolean chipeado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "familiar", nullable = true)
    private Usuario familiar;

}