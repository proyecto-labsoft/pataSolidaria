package mascotas.project.services;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.MascotaDTODetalle;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.entities.Mascota;
import mascotas.project.mapper.MascotaMapper;
import mascotas.project.repositories.MascotaRepository;
import mascotas.project.repositories.UsuarioRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class MascotaService {

    private MascotaRepository mascotaRepository;
    private UsuarioRepository usuarioRepository;
    private MascotaMapper mascotaMapper;


    @Transactional
    public MascotaDTOSaveSucces saveMascota(MascotaDTORequest mascotaDTORequest) throws ChangeSetPersister.NotFoundException {

        usuarioRepository.findById(mascotaDTORequest.getFamiliarId())
                         .orElseThrow(ChangeSetPersister.NotFoundException::new); //TODO: implementar las excepciones

        Mascota mascota = mascotaMapper.toEntity(mascotaDTORequest);
        mascota = mascotaRepository.save(mascota);

        return MascotaDTOSaveSucces.builder()
                                   .id(mascota.getId())
                                   .nombre(mascota.getNombre())
                                   .familiarId(mascota.getFamiliar().getId())
                                   .build();
    }

    @Transactional
    public MascotaDTODetalle getMascotaById(Long id) throws ChangeSetPersister.NotFoundException {

        Mascota mascota = mascotaRepository.findById(id)
                                           .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        return mascotaMapper.toDTO(mascota);
    }


    public List<MascotaDTODetalle> getMascotasByFamiliarId(Long usuarioId) throws ChangeSetPersister.NotFoundException {

       usuarioRepository.findById(usuarioId)
                        .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        return mascotaRepository.findByFamiliarId(usuarioId)
                                .stream()
                                .map(mascotaMapper::toDTO)
                                .toList();
    }

    //implementar servicio para declarar a la mascota perdida



}
