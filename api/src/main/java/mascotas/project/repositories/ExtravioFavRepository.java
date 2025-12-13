package mascotas.project.repositories;

import mascotas.project.entities.ExtravioFavorito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExtravioFavRepository extends JpaRepository<ExtravioFavorito, Long> {


    List<ExtravioFavorito> findAllByUsuarioId(Long usuarioId);

    ExtravioFavorito findByUsuarioIdAndExtravioId(Long usuarioId, Long extravioId);
}
