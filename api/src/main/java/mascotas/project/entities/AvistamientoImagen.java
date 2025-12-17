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
@Table(name = "avistamiento_imagen", schema = "public")
public class AvistamientoImagen {

    @EmbeddedId
    private AvistamientoImagenId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("avistamientoId")
    @JoinColumn(name = "avistamiento_id")
    private Avistamiento avistamiento;

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
    public static class AvistamientoImagenId implements Serializable {
        @Column(name = "avistamiento_id")
        private Long avistamientoId;

        @Column(name = "imagen_id")
        private Long imagenId;
    }
}
