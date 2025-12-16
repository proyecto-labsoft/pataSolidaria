package mascotas.project.services.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.AvistamientoDetailDTO;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import mascotas.project.entities.Extravio;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.AvistamientoMapper;
import mascotas.project.repositories.AvistamientoRepository;
import mascotas.project.services.interfaces.AvistamientoService;
import mascotas.project.services.interfaces.ExtravioService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class AvistamientoServiceImpl implements AvistamientoService {

    private final UsuarioService usuarioService;
    private final ExtravioService extravioService;
    private final AvistamientoRepository avistamientoRepository;
    private final AvistamientoMapper avistamientoMapper;
    private final FirebaseNotificationService notificationService;


    @Override
    @Transactional
    public Avistamiento saveAvistamiento(AvistamientoRequestDTO request){

        //validaciones del request
        usuarioService.getUsuarioById(request.getUsuarioId());
        Extravio extravioEntity = extravioService.getExtravioEntityById(request.getExtravioId());

        Avistamiento avist = avistamientoRepository.save( avistamientoMapper.toEntity(request) );

        log.info("SAVE_AVISTAMIENTO {}", avist.toString());

        //modifico el ultimo avistamiento de Extravio
        extravioService.setUltimoAvistamiento( extravioEntity, avist.getHora() );

        // return avist;
        // Avistamiento avistamiento = mapper.toEntity(requestDTO);
        // Avistamiento savedAvistamiento = avistamientoRepository.save(avistamiento);

        // Enviar notificación al dueño del extravio
        try {
            var duenio = usuarioService.getUsuarioById(extravioEntity.getCreador());
            var duenioEntity = usuarioService.findByFirebaseUid(duenio.getFirebaseUid());
            
            if (duenioEntity != null && duenioEntity.getPushToken() != null && 
                duenioEntity.getNotificacionesHabilitadas()) {
                
                String nombreMascota = extravioEntity.getMascota() != null ? 
                    extravioEntity.getMascota().getNombre() : "tu mascota";
                
                Map<String, String> data = new HashMap<>();
                data.put("type", "avistamiento");
                data.put("extravioId", extravioEntity.getId().toString());
                data.put("avistamientoId", avist.getId().toString());
                
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

        return avist;
    }

    @Override
    public List<AvistamientoDetailDTO> getAvistamientosByExtravio(Long extravioId){

        extravioService.getExtravioEntityById(extravioId);

        return Optional.ofNullable(avistamientoRepository.findByExtravioIdOrderByHoraDesc(extravioId))
                .filter(list -> !list.isEmpty())
                .map( avistamientoMapper::toDetailList )
                .orElseThrow(() -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()));


    }
}