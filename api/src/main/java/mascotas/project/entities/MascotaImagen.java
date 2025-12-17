package mascotas.project.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Data
@Table(name = "mascota_imagen", schema = "public")
public class MascotaImagen {

    @EmbeddedId
    private MascotaImagenId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("mascotaId")
    @JoinColumn(name = "mascota_id")
    private Mascota mascota;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("imagenId")
    @JoinColumn(name = "imagen_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Imagen imagen;

    @Column(name = "orden")
    @Builder.Default
    private Integer orden = 0;

    // Clase embebida para la clave compuesta
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MascotaImagenId implements Serializable {
        @Column(name = "mascota_id")
        private Long mascotaId;

        @Column(name = "imagen_id")
        private Long imagenId;
    }
}
