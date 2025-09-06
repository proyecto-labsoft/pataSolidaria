package mascotas.project.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Adopcion", schema = "public")
public class Adopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "adopcion_id_seq")
    @SequenceGenerator(name = "adopcion_id_seq", sequenceName = "adopcion_id_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrador")
    private Usuario administrador;

    @ManyToOne(fetch = FetchType.LAZY) // no seria un @OneToOne? no deberia haber varias adopciones para una mascota en un mismo momento
    @JoinColumn(name = "mascota")
    private Mascota mascota;

    @Column(nullable = false, length = 255)
    private String requisitos;

    @Column(nullable = false)
    private boolean transito;
}
