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

        emergencia = mapper.putToEntity(request, idEmergencia );

        return repository.save(emergencia);
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

}