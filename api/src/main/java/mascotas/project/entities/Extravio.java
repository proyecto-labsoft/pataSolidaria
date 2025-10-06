package mascotas.project.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "extravio", schema = "public")
public class Extravio {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "adopcion_id_seq")
    @SequenceGenerator(name = "adopcion_id_seq", sequenceName = "adopcion_id_seq", allocationSize = 1)
    private Long id;

    private Long creador;

    private Long mascota;

    private String zona;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime hora;

    //private LocalDateTime tiempo_gracia;

    private String observacion;

    private Boolean resuelto;
}
