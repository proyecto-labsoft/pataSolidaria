package mascotas.project.services.interfaces;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioFavRequestDTO;
import mascotas.project.entities.ExtravioFavorito;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExtravioFavService {

    void saveExtravioFav(ExtravioFavRequestDTO request);

    List<ExtravioDetailDTO> getExtFavoritosByUser(Long usuarioId);

    Boolean isFavorito(ExtravioFavRequestDTO request);

    void deleteExtravioFav( Long extravioId, Long usuarioId);

}
