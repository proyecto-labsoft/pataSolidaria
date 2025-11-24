package mascotas.project.services;

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
import mascotas.project.exceptions.NotFoundException;
import mascotas.project.mapper.AdopcionMapper;
import mascotas.project.repositories.AdopocionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class AdopcionService {

    private AdopocionRepository adopcionRepository;
    private AdopcionMapper adopcionMapper;
    private MascotaService mascotaService;

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
                    .map(adopcionMapper::toDetailDto)
                    .orElseThrow(() -> new BadRequestException(ErrorsEnums.BODY_NOT_NULL_ERROR.getDescription()));
    }


    public List<AdopcionDetailDTO> getAdopciones() {

        List<Adopcion> adopciones = adopcionRepository.findAll();

        return Optional.of(adopciones)
                        .filter(adopcionesList -> !adopcionesList.isEmpty())
                       .map(  adopcionMapper::toDetailDtoList)
                       .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()) );
    }

    public AdopcionDetailDTO getAdopcionById(Long adopcionId) {

        return adopcionRepository.findById(adopcionId)
                .map(adopcionMapper::toDetailDto)
                .orElseThrow( () -> new NotFoundException(ErrorsEnums.ADOPCION_NOT_FOUND_ERROR.getDescription()  + adopcionId));
    }
}