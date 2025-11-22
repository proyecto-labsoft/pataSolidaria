package mascotas.project.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.AvistamientoMapper;
import mascotas.project.repositories.AvistamientoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class AvistamientoService {

    private final UsuarioService  usuarioService;
    private final ExtravioService  extravioService;
    private final AvistamientoRepository avistamientoRepository;
    private final AvistamientoMapper mapper;


    @Transactional
    public Avistamiento saveAvistamiento(AvistamientoRequestDTO requestDTO){

        //validaciones del request
        usuarioService.getUsuarioById(requestDTO.getUsuarioId());
        extravioService.getExtravioEntityById(requestDTO.getExtravioId());

        log.info("SAVE_AVISTAMIENTO {}", requestDTO.toString());

        Avistamiento avistamiento = mapper.toEntity(requestDTO);

        log.info("SAVE_AVISTAMIENTO_ENTITYYYY {}", avistamiento.toString());

        return avistamientoRepository.save(avistamiento);
    }

    public List<Avistamiento> getAvistamientosByExtravio(Long extravioId){

        extravioService.getExtravioEntityById(extravioId);

        List <Avistamiento> avistamientos = Optional.of(extravioId)
                                                    .map(avistamientoRepository::findByExtravioIdOrderByHoraDesc)
                                                    .orElseThrow( ()-> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription() ) );

        return avistamientos;
    }

    //put de avistamiento

    //get de avistamiento by id

}
