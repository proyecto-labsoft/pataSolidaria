package mascotas.project.services.interfaces;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.PerdidoDTO;
import mascotas.project.entities.Extravio;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface ExtravioService {

    void saveExtravio(ExtravioRequestDTO extravioDto, Boolean animalAnonimo);

    List<ExtravioDetailDTO> getAllExtraviosByUsuario(Long  usuarioId, Boolean resueltos);

    List<ExtravioDetailDTO> getAllExtravios(Boolean resueltos);
    Extravio putExtravio(Long extravioId , ExtravioRequestDTO extravioRequest);
    void deleteExtravio( Long extravioId, Long usuarioId);
    Extravio getExtravioEntityById(Long id);
    PerdidoDTO getExtravioByMascotaId(Long mascotaId);
    List<ExtravioDetailDTO> getAllExtraviosByIds(List<Long> extraviosIds);

    Extravio setUltimoAvistamiento(Extravio extravio, LocalDateTime ultimoAvistamiento);
}