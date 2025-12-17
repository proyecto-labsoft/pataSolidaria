package mascotas.project.repositories;

import mascotas.project.entities.EmergenciaImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergenciaImagenRepository extends JpaRepository<EmergenciaImagen, EmergenciaImagen.EmergenciaImagenId> {
    
    List<EmergenciaImagen> findByIdEmergenciaIdOrderByOrdenAsc(Long emergenciaId);
    
    void deleteByIdEmergenciaId(Long emergenciaId);
    
    void deleteByIdImagenId(Long imagenId);
}
