package mascotas.project.services.impl;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.EmergenciaDetailDTO;
import mascotas.project.dto.EmergenciaRequestDTO;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Emergencia;
import mascotas.project.exceptions.ForbiddenException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.EmergenciaMapper;
import mascotas.project.repositories.EmergenciaRepository;
import mascotas.project.services.interfaces.EmergenciaService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class EmergenciaServiceImpl implements EmergenciaService {

    private final UsuarioService usuarioService;
    private final EmergenciaMapper mapper;
    private final EmergenciaRepository repository;

    @Override
    @Transactional
    public void saveEmergencia(EmergenciaRequestDTO request){

        Optional.of(request)
                .map(
                        requestDTO -> {
                            usuarioService.getUsuarioById(requestDTO.getUsuarioId());
                            return mapper.toEntity(requestDTO);
                        }
                ).map(
                        emergenciaEntity -> {
                            Emergencia emergencia =  repository.save(emergenciaEntity);
                            log.info("SAVE_EMERGENCIA : publicador ID:{} ; hora :{} ; atendido :{}" , emergenciaEntity.getCreador().getId(), emergenciaEntity.getHora(), emergenciaEntity.getAtendido() );
                            return emergencia;
                        }

                );
    }



    @Override
    public List<EmergenciaDetailDTO> getAllEmergencias(Boolean atendidos) {

        List<EmergenciaDetailDTO> emergenciaDtos = Optional.of(atendidos)
                                                            .map(repository::findAllByAtendidoOrderByHoraDesc)
                                                            .filter(emergencias -> !emergencias.isEmpty())
                                                            .map( mapper::toDetailDtoList )
                                                            .orElseThrow(
                                                                    ()-> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription())
                                                            );


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


        if (!isCreador(emergencia, usuario.getId())) {
            throw new ForbiddenException(ErrorsEnums.EMERGENCIA_FORBIDDEN_ERROR.getDescription() + emergencia.getId());
        }

        emergencia = mapper.putToEntity(request, idEmergencia );

        return repository.save(emergencia);
    }


    @Override
    @Transactional
    public void deleteEmergencia( Long emergenciaId, Long usuarioId){

        Emergencia emergencia = this.getEmergenciaEntityById(emergenciaId);
        usuarioService.getUsuarioById(usuarioId);

        if (!isCreador(emergencia, usuarioId)) {
            throw new ForbiddenException(ErrorsEnums.EMERGENCIA_FORBIDDEN_ERROR.getDescription() + emergencia.getId());
        }
        repository.delete(emergencia);
    }

    private Boolean isCreador(Emergencia emergencia, Long usuarioId){
        return emergencia.getCreador().getId().equals(usuarioId);
    }

    private Emergencia getEmergenciaEntityById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription() + id));
    }
}
