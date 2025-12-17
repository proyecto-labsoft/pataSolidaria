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
@Table(name = "emergencia_imagen", schema = "public")
public class EmergenciaImagen {

    @EmbeddedId
    private EmergenciaImagenId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("emergenciaId")
    @JoinColumn(name = "emergencia_id")
    private Emergencia emergencia;

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
    public static class EmergenciaImagenId implements Serializable {
        @Column(name = "emergencia_id")
        private Long emergenciaId;

        @Column(name = "imagen_id")
        private Long imagenId;
    }
}
