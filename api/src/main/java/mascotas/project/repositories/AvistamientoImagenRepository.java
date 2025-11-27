package mascotas.project.repositories;

import mascotas.project.entities.AvistamientoImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvistamientoImagenRepository extends JpaRepository<AvistamientoImagen, AvistamientoImagen.AvistamientoImagenId> {
    
    List<AvistamientoImagen> findByIdAvistamientoIdOrderByOrdenAsc(Long avistamientoId);
    
    void deleteByIdAvistamientoId(Long avistamientoId);
    
    void deleteByIdImagenId(Long imagenId);
}
