package mascotas.project.services.interfaces;

import mascotas.project.dto.EmergenciaAnimalAnonimoDTO;
import mascotas.project.dto.EmergenciaDetailDTO;
import mascotas.project.dto.EmergenciaRequestDTO;
import mascotas.project.entities.Emergencia;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmergenciaService {

    //void saveEmergencia(EmergenciaRequestDTO request);

    EmergenciaDetailDTO saveEmergenciaAnimalAnonimo(EmergenciaAnimalAnonimoDTO request);

    List<EmergenciaDetailDTO> getAllEmergencias(Boolean atendidos);

    EmergenciaDetailDTO getEmergenciaById(Long id);

    Emergencia putEmergencia(EmergenciaRequestDTO request, Long idEmergencia);

    void deleteEmergencia( Long emergenciaId, Long usuarioId);
}
