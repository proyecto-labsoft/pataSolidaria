package mascotas.project.services.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.AvistamientoDetailDTO;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.AvistamientoMapper;
import mascotas.project.repositories.AvistamientoRepository;
import mascotas.project.services.interfaces.AvistamientoService;
import mascotas.project.services.interfaces.ExtravioService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class AvistamientoServiceImpl implements AvistamientoService {

    private final UsuarioService usuarioService;
    private final ExtravioService extravioService;
    private final AvistamientoRepository avistamientoRepository;
    private final AvistamientoMapper avistamientoMapper;


    @Override
    @Transactional
    public Avistamiento saveAvistamiento(AvistamientoRequestDTO requestDTO){

        //validaciones del request
        usuarioService.getUsuarioById(requestDTO.getUsuarioId());
        extravioService.getExtravioEntityById(requestDTO.getExtravioId());

        log.info("SAVE_AVISTAMIENTO {}", requestDTO.toString());

        Avistamiento avistamiento = avistamientoMapper.toEntity(requestDTO);

        return avistamientoRepository.save(avistamiento);
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