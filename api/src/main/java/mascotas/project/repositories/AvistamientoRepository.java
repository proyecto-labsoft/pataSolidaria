package mascotas.project.repositories;

import mascotas.project.entities.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Long> {


    List<Avistamiento> findByExtravioIdOrderByHoraDesc(Long id);
}
