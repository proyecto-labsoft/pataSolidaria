package mascotas.project.services.impl;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.PosibleTutorDetail;
import mascotas.project.dto.PosibleTutorRequest;
import mascotas.project.entities.PosibleTutor;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.PosibleTutorMapper;
import mascotas.project.repositories.PosibleTutorRepository;
import mascotas.project.services.interfaces.ExtravioService;
import mascotas.project.services.interfaces.MascotaService;
import mascotas.project.services.interfaces.PosibleTutorService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class PosibleTutorServiceImpl implements PosibleTutorService {

    private final UsuarioService usuarioService;
    private final MascotaService mascotaService;
    private final ExtravioService extravioService;
    private final PosibleTutorMapper mapper;
    private final PosibleTutorRepository repository;

    @Override
    @Transactional
    public PosibleTutor savePosibleTutor(PosibleTutorRequest request){

        //validaciones del request
        usuarioService.getUsuarioById(request.getUsuarioId());
        extravioService.getExtravioEntityById(request.getExtravioId());

        PosibleTutor posibleTutor = mapper.toEntity(request);

        posibleTutor = repository.save(posibleTutor);

        log.info("POSIBLE_TUTOR_SAVE: id {} , usuarioId: {} , extravioId {}",
                posibleTutor.getId(),
                posibleTutor.getUsuario().getId(),
                posibleTutor.getExtravioId() );

        return posibleTutor;
    }


    @Override
    @Transactional
    public List<PosibleTutorDetail> getPosiblesTutores(Long extravioId){

        //validaciones del request
        extravioService.getExtravioEntityById(extravioId);

        List<PosibleTutor> posibleTutorList = repository.findAllByExtravioIdOrderByHoraDesc(extravioId);

        if (posibleTutorList.isEmpty()){ throw new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription());}

        return mapper.toResponseDetail(posibleTutorList);

    }
}
