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
@Table(name = "extravio_imagen", schema = "public")
public class ExtravioImagen {

    @EmbeddedId
    private ExtravioImagenId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("extravioId")
    @JoinColumn(name = "extravio_id")
    private Extravio extravio;

    @ManyToOne(fetch = FetchType.LAZY)
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
    public static class ExtravioImagenId implements Serializable {
        @Column(name = "extravio_id")
        private Long extravioId;

        @Column(name = "imagen_id")
        private Long imagenId;
    }
}
