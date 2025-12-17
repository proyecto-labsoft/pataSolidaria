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

        List<ExtravioDetailDTO> extraviosDtos = Optional.of(resueltos)
                                               .map(extravioRepository::findAllByResuelto)
                                                .orElseThrow(
                                                        ()-> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription())
                                                );


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
                // Obtener la entidad Usuario completa por ID usando el repositorio
                var usuarioEntity = usuarioRepository.findById(usuario.getId()).orElse(null);
                
                if (usuarioEntity != null && 
                    usuarioEntity.getNotificacionesHabilitadas() && 
                    usuarioEntity.getPushToken() != null && 
                    !usuarioEntity.getPushToken().trim().isEmpty() && 
                    !"null".equalsIgnoreCase(usuarioEntity.getPushToken().trim())) {
                    
                    // Obtener la mascota completa (getMascota() retorna Long, no Mascota)
                    Mascota mascotaEntity = mascotaService.getMascotaEntityById(savedExtravio.getMascota());
                    String nombreMascota = mascotaEntity != null ? mascotaEntity.getNombre() : "tu mascota";
                    
                    Map<String, String> data = new HashMap<>();
                    data.put("type", "extravio_encontrado");
                    data.put("extravioId", savedExtravio.getId().toString());
                    
                    // Determinar el género para el mensaje
                    String genero = "o"; // Por defecto masculino
                    if (mascotaEntity != null && mascotaEntity.getSexo() != null && 
                        "H".equalsIgnoreCase(mascotaEntity.getSexo().toString())) {
                        genero = "a";
                    }
                    
                    boolean enviado = expoPushNotificationService.sendNotification(
                        usuarioEntity.getPushToken(),
                        "🎉 ¡" + nombreMascota + " fue encontrad" + genero + "!",
                        "El caso de extravio ha sido marcado como resuelto. ¡Felicitaciones!",
                        data
                    );
                    
                    if (enviado) {
                        log.info("🔔 Notificación Expo de extravio resuelto enviada al usuario: {}", usuarioEntity.getEmail());
                    } else {
                        log.warn("⚠️ No se pudo enviar notificación de extravio resuelto al usuario: {} (token inválido o error de servicio)", usuarioEntity.getEmail());
                    }
                } else {
                    log.debug("ℹ️ No se envió notificación de extravio resuelto: usuario {} no cumple requisitos", 
                             usuarioEntity != null ? usuarioEntity.getEmail() : "desconocido");
                }
            } catch (Exception e) {
                log.error("❌ Error al enviar notificación de extravio resuelto: {}", e.getMessage());
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
