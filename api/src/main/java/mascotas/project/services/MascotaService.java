package mascotas.project.services;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.MascotaDTODetalle;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.NotFoundException;
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
    public MascotaDTOSaveSucces saveMascota(MascotaDTORequest mascotaDTORequest){

        usuarioRepository.findById(mascotaDTORequest.getFamiliarId())
                         .orElseThrow( () -> new NotFoundException(ErrorsEnums.USUARIO_NOT_FOUND.getDescription() + mascotaDTORequest.getFamiliarId() ) );

        Mascota mascota = mascotaMapper.toEntity(mascotaDTORequest);
        mascota = mascotaRepository.save(mascota);

        return MascotaDTOSaveSucces.builder()
                                   .id(mascota.getId())
                                   .nombre(mascota.getNombre())
                                   .familiarId(mascota.getFamiliar().getId())
                                   .build();
    }

    public MascotaDTODetalle getMascotaById(Long id){

        Mascota mascota = mascotaRepository.findById(id)
                                           .orElseThrow(() -> new NotFoundException(ErrorsEnums.MASCOTA_NOT_FOUND.getDescription() + id));

        return mascotaMapper.toDTO(mascota);
    }


    public Mascota getMascotaEntityById(Long id){

        return mascotaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorsEnums.MASCOTA_NOT_FOUND.getDescription() + id));
    }


    public List<MascotaDTODetalle> getMascotasByFamiliarId(Long usuarioId){

       usuarioRepository.findById(usuarioId)
                        .orElseThrow(() -> new NotFoundException(ErrorsEnums.USUARIO_NOT_FOUND.getDescription() + usuarioId ) );

        return mascotaRepository.findByFamiliarId(usuarioId)
                                .stream()
                                .map(mascotaMapper::toDTO)
                                .toList();
    }

    //implementar servicio para declarar a la mascota perdida



}
