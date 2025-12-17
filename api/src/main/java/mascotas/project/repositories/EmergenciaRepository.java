package mascotas.project.repositories;

import mascotas.project.entities.Adopcion;
import mascotas.project.entities.Emergencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EmergenciaRepository extends JpaRepository<Emergencia, Long> {

    List<Emergencia> findAllByAtendidoOrderByHoraDesc(Boolean atendido);

    List<Emergencia> findAllByOrderByHoraDesc();

}
