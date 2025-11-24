package mascotas.project.repositories;

import mascotas.project.entities.Adopcion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdopocionRepository  extends JpaRepository<Adopcion, Long> {
}
