package mascotas.project.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Data
@Table(name = "imagen", schema = "public")
public class Imagen {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "imagen_id_seq")
    @SequenceGenerator(name = "imagen_id_seq", sequenceName = "imagen_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "nombre_archivo", length = 255, nullable = false)
    private String nombreArchivo;

    @Column(name = "ruta_storage", length = 500, nullable = false)
    private String rutaStorage;

    @Column(name = "url_publica", length = 1000)
    private String urlPublica;

    @Column(name = "tipo_mime", length = 100)
    private String tipoMime;

    @Column(name = "tamanio")
    private Long tamanio;

    @Column(name = "fecha_subida")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime fechaSubida;

    @PrePersist
    protected void onCreate() {
        if (fechaSubida == null) {
            fechaSubida = LocalDateTime.now();
        }
    }
}
