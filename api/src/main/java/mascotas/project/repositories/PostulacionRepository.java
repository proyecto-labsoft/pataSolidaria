package mascotas.project.repositories;

import mascotas.project.entities.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {

    Optional<List<Postulacion>> findPostulacionesByUsuarioId (Long usuarioId);

    Optional<List<Postulacion>> findPostulacionesByAdopcionIdOrderByFechaDesc (Long adopcionId);
}
