package mascotas.project.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import mascotas.project.Enums.SexoEnum;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "companiero", schema = "public")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "companiero_id_seq")
    @SequenceGenerator(name = "companiero_id_seq", sequenceName = "companiero_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(nullable = false)
    private String especie;

    @Column(nullable = false)
    private String raza;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private SexoEnum sexo;

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
    @JoinColumn(name = "familiar", nullable = false)
    private Usuario familiar;

}