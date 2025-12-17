package mascotas.project.services.impl;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.AdopcionRequestDTO;
import mascotas.project.dto.AdopcionDetailDTO;
import mascotas.project.entities.Adopcion;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.BadRequestException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.AdopcionMapper;
import mascotas.project.repositories.AdopocionRepository;
import mascotas.project.services.interfaces.AdopcionService;
import mascotas.project.services.interfaces.ExpoPushNotificationService;
import mascotas.project.services.interfaces.MascotaService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class AdopcionServiceImpl implements AdopcionService {

    private AdopocionRepository adopcionRepository;
    private AdopcionMapper adopcionMapper;
    private MascotaService mascotaService;
    private ExpoPushNotificationService notificationService;
    private UsuarioService usuarioService;

    @Override
    @Transactional
    public AdopcionDetailDTO saveAdopcion(AdopcionRequestDTO adopcionRequestDtoRequest) {
        return Optional.ofNullable(adopcionRequestDtoRequest)
                    .map(
                        dto -> {
                            //verifico que el animal exista
                           Mascota mascota = mascotaService.getMascotaEntityById(dto.getMascotaID());

                            //verifico que el publicador sea familiar del animal
                            return Optional.of(mascota)
                                           .filter(m -> Objects.equals( m.getFamiliar().getId(), adopcionRequestDtoRequest.getPublicadorID() ))
                                           .map(m -> adopcionMapper.toEntity(adopcionRequestDtoRequest))
                                           .orElseThrow(
                                                    () -> new BadRequestException(ErrorsEnums.NO_FAMILIAR_ERROR.getDescription() + dto.getMascotaID())
                                           );

                        }
                    )
                    .map(adopcionRepository::save)
                    .map(adopcion -> {
                        // Enviar notificación broadcast a todos los usuarios con notificaciones habilitadas
                        try {
                            Mascota mascota = mascotaService.getMascotaEntityById(adopcion.getMascota().getId());
                            
                            // Obtener todos los usuarios con notificaciones habilitadas
                            var usuarios = usuarioService.findAllWithNotificationsEnabled();
                            List<String> tokens = usuarios.stream()
                                    .map(u -> u.getPushToken())
                                    .filter(token -> token != null && 
                                            !token.trim().isEmpty() && 
                                            !"null".equalsIgnoreCase(token.trim()))
                                    .collect(Collectors.toList());
                            
                            if (!tokens.isEmpty()) {
                                Map<String, String> data = new HashMap<>();
                                data.put("type", "adopcion");
                                data.put("adopcionId", adopcion.getId().toString());
                                data.put("mascotaId", adopcion.getMascota().toString());
                                
                                var result = notificationService.sendMulticastNotification(
                                    tokens,
                                    "🐶 Nueva mascota en adopción",
                                    mascota.getNombre() + " está buscando un hogar. ¿Te interesa adoptarlo?",
                                    data
                                );
                                
                                if (result != null) {
                                    int successCount = (int) result.getOrDefault("successCount", 0);
                                    log.info("🔔 Notificación Expo de nueva adopción enviada a {} usuarios", successCount);
                                } else {
                                    log.warn("⚠️ No se pudo enviar notificación de nueva adopción");
                                }
                            } else {
                                log.debug("ℹ️ No hay usuarios con tokens válidos para notificar sobre nueva adopción");
                            }
                        } catch (Exception e) {
                            log.error("❌ Error al enviar notificación de nueva adopción: {}", e.getMessage());
                        }
                        
                        return adopcion;
                    })
                    .map(adopcionMapper::toDetailDto)
                    .orElseThrow(() -> new BadRequestException(ErrorsEnums.BODY_NOT_NULL_ERROR.getDescription()));
    }


    @Override
    public List<AdopcionDetailDTO> getAdopciones() {

        List<Adopcion> adopciones = adopcionRepository.findAll();

        return Optional.of(adopciones)
                        .filter(adopcionesList -> !adopcionesList.isEmpty())
                       .map(  adopcionMapper::toDetailDtoList)
                       .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()) );
    }

    @Override
    public AdopcionDetailDTO getAdopcionById(Long adopcionId) {

        return adopcionRepository.findById(adopcionId)
                .map(adopcionMapper::toDetailDto)
                .orElseThrow( () -> new NoContentException(ErrorsEnums.ADOPCION_NOT_FOUND_ERROR.getDescription()  + adopcionId));
    }
}