package mascotas.project.repositories;

import mascotas.project.entities.AdopcionImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdopcionImagenRepository extends JpaRepository<AdopcionImagen, AdopcionImagen.AdopcionImagenId> {
    
    List<AdopcionImagen> findByIdAdopcionIdOrderByOrdenAsc(Long adopcionId);
    
    void deleteByIdAdopcionId(Long adopcionId);
    
    void deleteByIdImagenId(Long imagenId);
}
