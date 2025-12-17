package mascotas.project.services.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.AvistamientoDetailDTO;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import mascotas.project.entities.Extravio;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.AvistamientoMapper;
import mascotas.project.repositories.AvistamientoRepository;
import mascotas.project.repositories.UsuarioRepository;
import mascotas.project.services.interfaces.AvistamientoService;
import mascotas.project.services.interfaces.ExtravioService;
import mascotas.project.services.interfaces.ExpoPushNotificationService;
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
    private final ExpoPushNotificationService notificationService;
    private final UsuarioRepository usuarioRepository;
    private final mascotas.project.services.interfaces.MascotaService mascotaService;


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
            // Obtener la entidad Usuario completa del repositorio (UsuarioDTO no tiene firebaseUid ni pushToken)
            var duenioEntity = usuarioRepository.findById(duenio.getId()).orElse(null);
            
            if (duenioEntity != null && 
                duenioEntity.getNotificacionesHabilitadas() && 
                duenioEntity.getPushToken() != null && 
                !duenioEntity.getPushToken().trim().isEmpty() && 
                !"null".equalsIgnoreCase(duenioEntity.getPushToken().trim())) {
                
                // Obtener la mascota completa (getMascota() retorna Long, no Mascota)
                Mascota mascotaEntity = mascotaService.getMascotaEntityById(extravioEntity.getMascota());
                String nombreMascota = mascotaEntity != null ? mascotaEntity.getNombre() : "tu mascota";
                
                Map<String, String> data = new HashMap<>();
                data.put("type", "avistamiento");
                data.put("extravioId", extravioEntity.getId().toString());
                data.put("avistamientoId", avist.getId().toString());
                
                boolean enviado = notificationService.sendNotification(
                    duenioEntity.getPushToken(),
                    "🐾 ¡Nuevo avistamiento de " + nombreMascota + "!",
                    "Alguien reportó haber visto a " + nombreMascota + ". Revisa los detalles.",
                    data
                );
                
                if (enviado) {
                    log.info("🔔 Notificación Expo de avistamiento enviada al usuario: {}", duenioEntity.getEmail());
                } else {
                    log.warn("⚠️ No se pudo enviar notificación Expo de avistamiento al usuario: {} (token inválido o error de servicio)", duenioEntity.getEmail());
                }
            } else {
                log.debug("ℹ️ No se envió notificación de avistamiento: usuario {} no cumple requisitos (notificaciones habilitadas y token válido)", 
                         duenioEntity != null ? duenioEntity.getEmail() : "desconocido");
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