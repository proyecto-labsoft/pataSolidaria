package mascotas.project.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.AvistamientoDetailDTO;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.AvistamientoMapper;
import mascotas.project.repositories.AvistamientoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class AvistamientoService {

    private final UsuarioService  usuarioService;
    private final ExtravioService  extravioService;
    private final AvistamientoRepository avistamientoRepository;
    private final AvistamientoMapper mapper;
    private final AvistamientoMapper avistamientoMapper;
    private final FirebaseNotificationService notificationService;


    @Transactional
    public Avistamiento saveAvistamiento(AvistamientoRequestDTO requestDTO){

        //validaciones del request
        usuarioService.getUsuarioById(requestDTO.getUsuarioId());
        var extravio = extravioService.getExtravioEntityById(requestDTO.getExtravioId());

        log.info("SAVE_AVISTAMIENTO {}", requestDTO.toString());

        Avistamiento avistamiento = mapper.toEntity(requestDTO);
        Avistamiento savedAvistamiento = avistamientoRepository.save(avistamiento);

        // Enviar notificación al dueño del extravio
        try {
            var duenio = usuarioService.getUsuarioById(extravio.getCreador());
            var duenioEntity = usuarioService.findByFirebaseUid(duenio.getFirebaseUid());
            
            if (duenioEntity != null && duenioEntity.getPushToken() != null && 
                duenioEntity.getNotificacionesHabilitadas()) {
                
                String nombreMascota = extravio.getMascota() != null ? 
                    extravio.getMascota().getNombre() : "tu mascota";
                
                Map<String, String> data = new HashMap<>();
                data.put("type", "avistamiento");
                data.put("extravioId", extravio.getId().toString());
                data.put("avistamientoId", savedAvistamiento.getId().toString());
                
                notificationService.sendNotification(
                    duenioEntity.getPushToken(),
                    "🐾 ¡Nuevo avistamiento de " + nombreMascota + "!",
                    "Alguien reportó haber visto a " + nombreMascota + ". Revisa los detalles.",
                    data
                );
                
                log.info("🔔 Notificación de avistamiento enviada al usuario: {}", duenioEntity.getEmail());
            }
        } catch (Exception e) {
            log.error("❌ Error al enviar notificación de avistamiento: {}", e.getMessage());
            // No lanzamos excepción para que el avistamiento se guarde aunque falle la notificación
        }

        return savedAvistamiento;
    }

    public List<AvistamientoDetailDTO> getAvistamientosByExtravio(Long extravioId){

        extravioService.getExtravioEntityById(extravioId);

        return Optional.ofNullable(avistamientoRepository.findByExtravioIdOrderByHoraDesc(extravioId))
                .filter(list -> !list.isEmpty())
                .map( avistamientoMapper::toDetailList )
                .orElseThrow(() -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()));


    }
}