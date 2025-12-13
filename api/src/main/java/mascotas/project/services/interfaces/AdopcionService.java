package mascotas.project.services.interfaces;

import mascotas.project.dto.AdopcionDetailDTO;
import mascotas.project.dto.AdopcionRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdopcionService {

    AdopcionDetailDTO saveAdopcion(AdopcionRequestDTO adopcionRequestDtoRequest);

    List<AdopcionDetailDTO> getAdopciones();

    AdopcionDetailDTO getAdopcionById(Long adopcionId);
}
