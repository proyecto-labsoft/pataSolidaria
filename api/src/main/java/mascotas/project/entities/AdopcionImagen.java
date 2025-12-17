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
@Table(name = "adopcion_imagen", schema = "public")
public class AdopcionImagen {

    @EmbeddedId
    private AdopcionImagenId id;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("adopcionId")
    @JoinColumn(name = "adopcion_id")
    private Adopcion adopcion;

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
    public static class AdopcionImagenId implements Serializable {
        @Column(name = "adopcion_id")
        private Long adopcionId;

        @Column(name = "imagen_id")
        private Long imagenId;
    }
}
