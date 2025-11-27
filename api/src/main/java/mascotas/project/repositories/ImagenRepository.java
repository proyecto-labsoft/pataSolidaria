package mascotas.project.repositories;

import mascotas.project.entities.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImagenRepository extends JpaRepository<Imagen, Long> {
    
    Optional<Imagen> findByRutaStorage(String rutaStorage);
    
}
