package mascotas.project.services.impl;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.PerdidoDTO;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.ForbiddenException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.ExtravioMapper;
import mascotas.project.repositories.ExtravioRepository;
import mascotas.project.repositories.UsuarioRepository;
import mascotas.project.services.interfaces.ExtravioService;
import mascotas.project.services.interfaces.ExpoPushNotificationService;
import mascotas.project.services.interfaces.MascotaService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class ExtravioServiceImpl implements ExtravioService {

    private final UsuarioService usuarioService;
    private final MascotaService mascotaService;
    private final ExtravioMapper extravioMapper;
    private final ExtravioRepository extravioRepository;
    private final ExpoPushNotificationService expoPushNotificationService;
    private final UsuarioRepository usuarioRepository;
    private final mascotas.project.repositories.AvistamientoRepository avistamientoRepository;

    @Override
    @Transactional
    public void saveExtravio(ExtravioRequestDTO extravioDto, Boolean animalAnonimo) {

        Optional.of(extravioDto)
                .map(
                    extravioDTO -> {
                            //busco la mascota
                            mascotaService.getMascotaEntityById(extravioDTO.getMascotaId());
                            //busco el usuario
                            usuarioService.getUsuarioById(extravioDTO.getCreador());

                           return extravioMapper.toEntity(extravioDto, animalAnonimo); //mapeo el dto
                    }
                )
                .map(
                        extravioEntity -> {
                            Extravio extravio =  extravioRepository.save(extravioEntity);
                            log.info("SAVE_EXTRAVIO : publicador ID:{} ; mascota ID:{} ; idExtravio:{}" , extravioEntity.getCreador(), extravioEntity.getMascota(), extravio.getId());
                            return extravio;
                        }
                );
    }

    @Override
    public List<ExtravioDetailDTO> getAllExtraviosByUsuario(Long  usuarioId, Boolean resueltos){

        usuarioService.getUsuarioById(usuarioId);

        List<ExtravioDetailDTO> extraviosDtos = Optional.ofNullable(resueltos)
                                                                .map(r -> extravioRepository.findAllByCreadorAndResuelto(usuarioId, r) )
                                                                .orElseGet(() -> extravioRepository.findAllByCreador(usuarioId));

        return setMascotaDetailToExtravioDtoList(extraviosDtos);
    }

    @Override
    public List<ExtravioDetailDTO> getAllExtravios(Boolean resueltos) {

        List<ExtravioDetailDTO> extraviosDtos = Optional.ofNullable(resueltos)
                                               .map(extravioRepository::findAllByResuelto)
                                               .orElseGet(extravioRepository::findAllExtravio);

        if ( extraviosDtos.isEmpty() ){ throw new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription());}

        return setMascotaDetailToExtravioDtoList(extraviosDtos);
    }

    @Override
    @Transactional
    public Extravio putExtravio( Long extravioId , ExtravioRequestDTO extravioRequest){

        Extravio extravio = this.getExtravioEntityById(extravioId);
        UsuarioDTO usuario = usuarioService.getUsuarioById(extravioRequest.getCreador());
        mascotaService.getMascotaById(extravioRequest.getMascotaId());

        if (!isCreador(extravio, usuario.getId())) {
            throw new ForbiddenException(ErrorsEnums.EXTRAVIO_FORBIDDEN_ERROR.getDescription() + extravio.getId());
        }

        // Verificar si se está marcando como resuelto
        boolean estaMarcandoComoResuelto = !extravio.getResuelto() && extravioRequest.getResuelto();

        extravio = extravioMapper.putToEntity(extravioRequest, extravioId, extravio.getCreadoByFamiliar());
        Extravio savedExtravio = extravioRepository.save(extravio);

        // Enviar notificación si se marcó como encontrado
        if (estaMarcandoComoResuelto) {
            try {
                // Obtener la mascota completa
                Mascota mascotaEntity = mascotaService.getMascotaEntityById(savedExtravio.getMascota());
                String nombreMascota = mascotaEntity != null && mascotaEntity.getNombre() != null && mascotaEntity.getNombre().length() > 0
                                            ? mascotaEntity.getNombre()
                                            : "";
                
                // Determinar el género para el mensaje
                String genero = "o"; // Por defecto masculino
                if (mascotaEntity != null && mascotaEntity.getSexo() != null && 
                    "H".equalsIgnoreCase(mascotaEntity.getSexo().toString())) {
                    genero = "a";
                }
                
                String titulo = "🎉 ¡" + (nombreMascota.length() > 0 ? nombreMascota + " fue encontrad" + genero : "Fue encontrad" + genero) + "!";
                String cuerpo = "El caso de extravio ha sido marcado como resuelto. ¡Felicitaciones!";
                
                Map<String, String> data = new HashMap<>();
                data.put("type", "extravio_encontrado");
                data.put("extravioId", savedExtravio.getId().toString());
                
                boolean esCreador = isCreador(extravio, usuario.getId());
                
                // Si el creador lo marcó como resuelto, notificar a los que reportaron avistamientos
                if (esCreador) {
                    // Obtener todos los avistamientos del extravío
                    List<mascotas.project.entities.Avistamiento> avistamientos = avistamientoRepository.findByExtravioIdOrderByHoraDesc(savedExtravio.getId());
                    
                    // Obtener IDs únicos de usuarios que reportaron avistamientos (excluir al creador)
                    java.util.Set<Long> usuariosAvistadores = avistamientos.stream()
                        .map(mascotas.project.entities.Avistamiento::getUsuarioId)
                        .filter(id -> !id.equals(usuario.getId()))
                        .collect(java.util.stream.Collectors.toSet());
                    
                    log.info("🔔 Notificando a {} usuarios que reportaron avistamientos", usuariosAvistadores.size());
                    
                    // Enviar notificación a cada usuario avistador
                    for (Long avistadorId : usuariosAvistadores) {
                        try {
                            var avistadorEntity = usuarioRepository.findById(avistadorId).orElse(null);
                            
                            if (avistadorEntity != null && 
                                avistadorEntity.getNotificacionesHabilitadas() && 
                                avistadorEntity.getPushToken() != null && 
                                !avistadorEntity.getPushToken().trim().isEmpty() && 
                                !"null".equalsIgnoreCase(avistadorEntity.getPushToken().trim())) {
                                
                                boolean enviado = expoPushNotificationService.sendNotification(
                                    avistadorEntity.getPushToken(),
                                    titulo,
                                    "¡Gracias por tu ayuda! " + cuerpo,
                                    data
                                );
                                
                                if (enviado) {
                                    log.info("🔔 Notificación enviada al avistador: {}", avistadorEntity.getEmail());
                                } else {
                                    log.warn("⚠️ No se pudo enviar notificación al avistador: {}", avistadorEntity.getEmail());
                                }
                            }
                        } catch (Exception e) {
                            log.error("❌ Error al enviar notificación a avistador {}: {}", avistadorId, e.getMessage());
                        }
                    }
                } else {
                    // Si otra persona lo marcó como resuelto, notificar al creador Y a los avistadores
                    
                    // 1. Notificar al creador del extravío
                    var creadorEntity = usuarioRepository.findById(savedExtravio.getCreador()).orElse(null);
                    
                    if (creadorEntity != null && 
                        creadorEntity.getNotificacionesHabilitadas() && 
                        creadorEntity.getPushToken() != null && 
                        !creadorEntity.getPushToken().trim().isEmpty() && 
                        !"null".equalsIgnoreCase(creadorEntity.getPushToken().trim())) {
                        
                        boolean enviado = expoPushNotificationService.sendNotification(
                            creadorEntity.getPushToken(),
                            titulo,
                            cuerpo,
                            data
                        );
                        
                        if (enviado) {
                            log.info("🔔 Notificación enviada al creador: {}", creadorEntity.getEmail());
                        } else {
                            log.warn("⚠️ No se pudo enviar notificación al creador: {}", creadorEntity.getEmail());
                        }
                    }
                    
                    // 2. Notificar a los que reportaron avistamientos (excluir al creador y al que resolvió)
                    List<mascotas.project.entities.Avistamiento> avistamientos = avistamientoRepository.findByExtravioIdOrderByHoraDesc(savedExtravio.getId());
                    
                    java.util.Set<Long> usuariosAvistadores = avistamientos.stream()
                        .map(mascotas.project.entities.Avistamiento::getUsuarioId)
                        .filter(id -> !id.equals(savedExtravio.getCreador()) && !id.equals(usuario.getId()))
                        .collect(java.util.stream.Collectors.toSet());
                    
                    log.info("🔔 Notificando a {} usuarios que reportaron avistamientos", usuariosAvistadores.size());
                    
                    for (Long avistadorId : usuariosAvistadores) {
                        try {
                            var avistadorEntity = usuarioRepository.findById(avistadorId).orElse(null);
                            
                            if (avistadorEntity != null && 
                                avistadorEntity.getNotificacionesHabilitadas() && 
                                avistadorEntity.getPushToken() != null && 
                                !avistadorEntity.getPushToken().trim().isEmpty() && 
                                !"null".equalsIgnoreCase(avistadorEntity.getPushToken().trim())) {
                                
                                boolean enviado = expoPushNotificationService.sendNotification(
                                    avistadorEntity.getPushToken(),
                                    titulo,
                                    "¡Gracias por tu ayuda! " + cuerpo,
                                    data
                                );
                                
                                if (enviado) {
                                    log.info("🔔 Notificación enviada al avistador: {}", avistadorEntity.getEmail());
                                } else {
                                    log.warn("⚠️ No se pudo enviar notificación al avistador: {}", avistadorEntity.getEmail());
                                }
                            }
                        } catch (Exception e) {
                            log.error("❌ Error al enviar notificación a avistador {}: {}", avistadorId, e.getMessage());
                        }
                    }
                }
            } catch (Exception e) {
                log.error("❌ Error al enviar notificaciones de extravio resuelto: {}", e.getMessage());
            }
        }

        return savedExtravio;
    }

    @Override
    @Transactional
    public void deleteExtravio( Long extravioId, Long usuarioId){

        Extravio extravio = this.getExtravioEntityById(extravioId);
        usuarioService.getUsuarioById(usuarioId);

        if (!isCreador(extravio, usuarioId)) {
            throw new ForbiddenException(ErrorsEnums.EXTRAVIO_FORBIDDEN_ERROR.getDescription() + extravio.getId());
        }
        extravioRepository.delete(extravio);
    }


    @Override
    public Extravio getExtravioEntityById(Long id){
        return extravioRepository.findById(id)
                .orElseThrow(() -> new NoContentException(ErrorsEnums.EXTRAVIO_NOT_FOUND_ERROR.getDescription() + id));
    }

    @Override
    public PerdidoDTO getExtravioByMascotaId(Long mascotaId){

        mascotaService.getMascotaEntityById(mascotaId);
        Optional<Extravio> extravio = extravioRepository.findByMascotaAndResueltoIsFalse(mascotaId); //busca el extravio abierto

        if (extravio.isPresent()){
            return PerdidoDTO.builder()
                    .extravio(extravioMapper.toDtoResponse(extravio.get()))
                    .estaExtraviado(Boolean.TRUE).build();
        }

        return  PerdidoDTO.builder()
                .extravio(null)
                .estaExtraviado(Boolean.FALSE).build();
    }

    @Override
    public List<ExtravioDetailDTO> getAllExtraviosByIds(List<Long> extraviosIds){

        List<Extravio> extravios = Optional.of( extravioRepository.findAllByIdInOrderByUltimoAvistamientoDesc(extraviosIds) )
                                                                .filter( exts -> !exts.isEmpty() )
                                                                .orElseThrow(
                                                                        () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription())
                                                                );

        List<ExtravioDetailDTO> extraviosDetail = extravioMapper.toExtravioDetailDTOList(extravios);

        return this.setMascotaDetailToExtravioDtoList(extraviosDetail);

    }


    @Override
    public Extravio setUltimoAvistamiento(Extravio extravio, LocalDateTime ultimoAvistamiento) {

        extravio.setUltimoAvistamiento(ultimoAvistamiento);

        Extravio ext = extravioRepository.save(extravio);

        log.info("SAVE_EXTRAVIO : publicador ID:{} ; mascota ID:{} ; idExtravio:{} ; ultimo_avistamiento:{}", ext.getCreador(), ext.getMascota(), extravio.getId(), ext.getUltimoAvistamiento());

        return ext;
    }

    ///  METODOS HELPERS ///

    private List<ExtravioDetailDTO> setMascotaDetailToExtravioDtoList(List<ExtravioDetailDTO> extravioDtos){

        return extravioDtos.stream()
                            .map(extravioDTO -> {
                                Mascota mascotaEntity = mascotaService.getMascotaEntityById(extravioDTO.getMascotaId());
                                return extravioMapper.toDtoDetail(extravioDTO, mascotaEntity);
                            })
                            .collect(Collectors.toList());

    }

    private Boolean isCreador(Extravio extravio, Long usuarioId){
        return extravio.getCreador().equals(usuarioId);
    }

}
