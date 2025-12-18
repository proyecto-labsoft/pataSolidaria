package mascotas.project.services.impl;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.EmergenciaAnimalAnonimoDTO;
import mascotas.project.dto.EmergenciaDetailDTO;
import mascotas.project.dto.EmergenciaRequestDTO;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Emergencia;
import mascotas.project.entities.Mascota;
import mascotas.project.entities.Usuario;
import mascotas.project.exceptions.ForbiddenException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.EmergenciaMapper;
import mascotas.project.repositories.EmergenciaRepository;
import mascotas.project.services.interfaces.EmergenciaService;
import mascotas.project.services.interfaces.MascotaService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class EmergenciaServiceImpl implements EmergenciaService {

    private final UsuarioService usuarioService;
    private final MascotaService mascotaService;
    private final EmergenciaMapper mapper;
    private final EmergenciaRepository repository;
    private final EmergenciaMapper emergenciaMapper;
    private final mascotas.project.services.interfaces.ExpoPushNotificationService expoPushNotificationService;

    @Transactional
    public EmergenciaDetailDTO saveEmergenciaAnimalAnonimo(EmergenciaAnimalAnonimoDTO request){

        return Optional.of(request)
                .map(
                        requestDTO -> {
                            //persisto la mascota anonima
                            MascotaDTOSaveSucces mascotaEntity = mascotaService.saveMascotaSinFamiliar( request.getDatosMascota() );
                            return mascotaEntity;
                        }
                ).map(
                        mascotaSaved -> {

                            usuarioService.getUsuarioById( request.getDatosEmergencia().getUsuarioId());

                            Emergencia emergenciaEntity = mapper.toEntity( request.getDatosEmergencia(), mascotaSaved );

                            emergenciaEntity = repository.save( emergenciaEntity );

                            log.info("SAVE_EMERGENCIA : publicador ID:{} ; mascota persistida ID: {} ; hora :{} ; atendido :{}" , emergenciaEntity.getCreador().getId(), mascotaSaved.getId() , emergenciaEntity.getHora(), emergenciaEntity.getAtendido() );
                            
                            // Enviar notificaciones a administradores
                            notifyAdminsAboutNewEmergencia(emergenciaEntity);
                            
                            return mapper.toDetailDto(emergenciaEntity);
                        }

                ).orElseThrow();
    }



    @Override
    public List<EmergenciaDetailDTO> getAllEmergencias(Boolean atendidos) {

        List<Emergencia> emergenciaEntityList = Optional.ofNullable(atendidos)
                                                            .map(repository::findAllByAtendidoOrderByHoraDesc )
                                                            .orElseGet( repository::findAllByOrderByHoraDesc );

        if ( emergenciaEntityList.isEmpty() ){ throw new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()); }

        List<EmergenciaDetailDTO> emergenciaDtos = mapper.toDetailDtoList(emergenciaEntityList);

        return emergenciaDtos;
    }


    @Override
    public EmergenciaDetailDTO getEmergenciaById(Long id){

        EmergenciaDetailDTO emergencia = repository.findById(id)
                                                    .map(mapper::toDetailDto)
                                                    .orElseThrow(
                                                            ()-> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription())
                                                    );

        return emergencia;
    }


    @Override
    @Transactional
    public Emergencia putEmergencia(EmergenciaRequestDTO request, Long idEmergencia){


        Emergencia emergencia = this.getEmergenciaEntityById(idEmergencia);

        UsuarioDTO usuario = usuarioService.getUsuarioById(request.getUsuarioId());

        if (Boolean.FALSE.equals( usuario.getAdministrador())){
            //si no es admin, verifica si es el creador
            if (!isCreador(emergencia, usuario.getId())) {
                throw new ForbiddenException(ErrorsEnums.EMERGENCIA_FORBIDDEN_ERROR.getDescription() + emergencia.getId());
            }
        }

        // Verificar si se está marcando como atendida por un admin
        boolean marcadaComoAtendida = !emergencia.getAtendido() && 
                                      request.getAtendido() != null && 
                                      request.getAtendido() &&
                                      Boolean.TRUE.equals(usuario.getAdministrador());

        emergencia = mapper.putToEntity(request, idEmergencia );
        emergencia = repository.save(emergencia);

        // Notificar al creador si un admin marcó la emergencia como atendida
        if (marcadaComoAtendida) {
            notifyCreatorAboutEmergenciaAtendida(emergencia);
        }

        return emergencia;
    }


    @Override
    @Transactional
    public void deleteEmergencia( Long emergenciaId, Long usuarioId){

        Emergencia emergencia = this.getEmergenciaEntityById(emergenciaId);

        UsuarioDTO usuario = usuarioService.getUsuarioById(usuarioId);

        if (Boolean.FALSE.equals( usuario.getAdministrador())){
            //si no es admin, verifica si es el creador
            if (!isCreador(emergencia, usuario.getId())) {
                throw new ForbiddenException(ErrorsEnums.EMERGENCIA_FORBIDDEN_ERROR.getDescription() + emergencia.getId());
            }
        }
        repository.delete(emergencia);
    }

    ///  METODOS HELPERS ///

    private Boolean isCreador(Emergencia emergencia, Long usuarioId){
        return emergencia.getCreador().getId().equals(usuarioId);
    }

    private Emergencia getEmergenciaEntityById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription() + id));
    }

    private void notifyAdminsAboutNewEmergencia(Emergencia emergencia) {
        try {
            List<Usuario> admins = usuarioService.findAllAdminsWithNotificationsEnabled();
            
            if (admins.isEmpty()) {
                log.info("No hay administradores con notificaciones habilitadas");
                return;
            }

            List<String> tokens = admins.stream()
                    .map(Usuario::getPushToken)
                    .filter(token -> token != null && !token.trim().isEmpty())
                    .toList();

            if (tokens.isEmpty()) {
                log.info("No hay administradores con tokens válidos");
                return;
            }

            String title = "🚨 Nueva Emergencia";
            String body = "Se reportó una nueva emergencia de un " + 
                         (emergencia.getMascota() != null ? emergencia.getMascota().getTipo() : "animal");
            
            java.util.Map<String, String> data = new java.util.HashMap<>();
            data.put("type", "nueva_emergencia");
            data.put("emergenciaId", emergencia.getId().toString());

            expoPushNotificationService.sendMulticastNotification(tokens, title, body, data);
            
            log.info("Notificación de emergencia enviada a {} administradores", tokens.size());
        } catch (Exception e) {
            log.error("Error al enviar notificaciones a administradores: {}", e.getMessage());
        }
    }

    private void notifyCreatorAboutEmergenciaAtendida(Emergencia emergencia) {
        try {
            Usuario creador = emergencia.getCreador();
            
            if (creador == null) {
                log.info("Emergencia sin creador, no se envía notificación");
                return;
            }

            if (!Boolean.TRUE.equals(creador.getNotificacionesHabilitadas()) || 
                creador.getPushToken() == null || 
                creador.getPushToken().trim().isEmpty()) {
                log.info("El creador no tiene notificaciones habilitadas o token válido");
                return;
            }

            String title = "✅ Emergencia Atendida";
            String body = "Tu reporte de emergencia ha sido atendido por un administrador";
            
            java.util.Map<String, String> data = new java.util.HashMap<>();
            data.put("type", "emergencia_atendida");
            data.put("emergenciaId", emergencia.getId().toString());

            expoPushNotificationService.sendNotification(creador.getPushToken(), title, body, data);
            
            log.info("Notificación de emergencia atendida enviada al usuario {}", creador.getId());
        } catch (Exception e) {
            log.error("Error al enviar notificación al creador: {}", e.getMessage());
        }
    }

}