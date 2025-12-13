package mascotas.project.services.interfaces;

import mascotas.project.dto.AvistamientoDetailDTO;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AvistamientoService {

    Avistamiento saveAvistamiento(AvistamientoRequestDTO requestDTO);

    List<AvistamientoDetailDTO> getAvistamientosByExtravio(Long extravioId);

}
