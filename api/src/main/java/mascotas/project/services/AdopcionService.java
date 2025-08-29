package mascotas.project.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.AdopcionDTO;
import mascotas.project.entities.Adopcion;
import mascotas.project.entities.Mascota;
import mascotas.project.mapper.AdopcionMapper;
import mascotas.project.repositories.AdopocionRepository;
import mascotas.project.repositories.MascotaRepository;
import mascotas.project.repositories.UsuarioRepository;
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
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Adopcion saveAdopcion(AdopcionDTO adopcionDtoRequest) {
        return Optional.ofNullable(adopcionDtoRequest)
                    .map(
                        dto -> {
                            //verifico que el animal exista
                           Mascota mascota = mascotaRepository.findById(dto.getMascotaId())
                                                              .orElseThrow(
                                                                    () -> new IllegalArgumentException("No se encontró la mascota con ID: " + dto.getMascotaId())
                                                              );

                            //verifico que el publicador sea familiar del animal
                            return Optional.of(mascota)
                                           //.filter(m -> Objects.equals( m.getFamiliar().getId(), adopcionDtoRequest.getPublicador() ))
                                           .map(m -> adopcionMapper.toEntity(adopcionDtoRequest))
                                           .orElseThrow(
                                                    () -> new IllegalArgumentException("El publicador no es familiar de la mascota")
                                           );

                        }
                    )
                    .map(adopcionRepository::save)
                    .orElseThrow(() -> new IllegalArgumentException("La solicitud de adopción no puede ser nula."));
    }


    public List<Adopcion> findAll() {
        return adopcionRepository.findAll();
    }

    //implementar MIS adopciones que publico (solo ARAF)


}
