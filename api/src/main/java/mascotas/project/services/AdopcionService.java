package mascotas.project.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.AdopcionDTO;
import mascotas.project.entities.Adopcion;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.BadRequestException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.exceptions.NotFoundException;
import mascotas.project.mapper.AdopcionMapper;
import mascotas.project.repositories.AdopocionRepository;
import mascotas.project.repositories.MascotaRepository;
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
    private MascotaRepository mascotaRepository;

    @Transactional
    public Adopcion saveAdopcion(AdopcionDTO adopcionDtoRequest) {
        return Optional.ofNullable(adopcionDtoRequest)
                    .map(
                        dto -> {
                            //verifico que el animal exista
                           Mascota mascota = mascotaRepository.findById(dto.getMascotaID())
                                                              .orElseThrow(
                                                                    () -> new NotFoundException(ErrorsEnums.MASCOTA_NOT_FOUND.getDescription() + dto.getMascotaID())
                                                              );

                            //verifico que el publicador sea familiar del animal
                            return Optional.of(mascota)
                                           .filter(m -> Objects.equals( m.getFamiliar().getId(), adopcionDtoRequest.getPublicadorID() ))
                                           .map(m -> adopcionMapper.toEntity(adopcionDtoRequest))
                                           .orElseThrow(
                                                    () -> new BadRequestException(ErrorsEnums.NO_FAMILIAR_ERROR.getDescription() + dto.getMascotaID())
                                           );

                        }
                    )
                    .map(adopcionRepository::save)
                    .orElseThrow(() -> new BadRequestException(ErrorsEnums.BODY_NOT_NULL_ERROR.getDescription()));
    }


    public List<AdopcionDTO> getAdopciones() {

        List<Adopcion> adopcionesEntity = adopcionRepository.findAll();

        return Optional.of(adopcionesEntity)
                        .filter(adopciones -> !adopcionesEntity.isEmpty())
                       .map(  adopciones -> adopciones.stream().map(adopcionMapper::toDto).toList())
                       .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()) );
    }

    //implementar MIS adopciones que publico (solo ARAF)


}
