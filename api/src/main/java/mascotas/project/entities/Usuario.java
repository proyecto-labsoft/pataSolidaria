package mascotas.project.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "usuario", schema = "public")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(name = "Usuario_id_seq", sequenceName = "Usuario_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(nullable = true)
    private Integer celular;

    @Column(length = 255)
    private String email;

    @Column(length = 255)
    private String direccion;

    @Column(nullable = true)
    private Boolean administrador;

    // Campos para autenticación y notificaciones
    @Column(name = "firebase_uid", unique = true)
    private String firebaseUid;

    @Column(name = "push_token")
    private String pushToken;

    @Column(name = "notificaciones_habilitadas")
    private Boolean notificacionesHabilitadas = true;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPANIERO_ID")
    @ToString.Exclude
    private List<Mascota> mascotas;

}