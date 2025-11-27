package mascotas.project.repositories;

import mascotas.project.entities.MascotaImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MascotaImagenRepository extends JpaRepository<MascotaImagen, MascotaImagen.MascotaImagenId> {
    
    List<MascotaImagen> findByIdMascotaIdOrderByOrdenAsc(Long mascotaId);
    
    void deleteByIdMascotaId(Long mascotaId);
    
    void deleteByIdImagenId(Long imagenId);
}
