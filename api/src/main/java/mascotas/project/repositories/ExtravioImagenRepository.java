package mascotas.project.repositories;

import mascotas.project.entities.ExtravioImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtravioImagenRepository extends JpaRepository<ExtravioImagen, ExtravioImagen.ExtravioImagenId> {
    
    List<ExtravioImagen> findByIdExtravioIdOrderByOrdenAsc(Long extravioId);
    
    void deleteByIdExtravioId(Long extravioId);
    
    void deleteByIdImagenId(Long imagenId);
}
