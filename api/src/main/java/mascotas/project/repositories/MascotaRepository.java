package mascotas.project.repositories;

import mascotas.project.entities.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    List<Mascota> findByFamiliarId(Long familiarId);
}
