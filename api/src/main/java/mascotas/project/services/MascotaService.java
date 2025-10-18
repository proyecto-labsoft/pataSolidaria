package mascotas.project.services;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.MascotaDTODetail;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.NotFoundException;
import mascotas.project.mapper.MascotaMapper;
import mascotas.project.repositories.MascotaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class MascotaService {

    private MascotaRepository mascotaRepository;
    private UsuarioService usuarioService;
    private MascotaMapper mascotaMapper;


    @Transactional
    public MascotaDTOSaveSucces saveMascota(MascotaDTORequest mascotaDTORequest){

        usuarioService.getUsuarioById(mascotaDTORequest.getFamiliarId());

        Mascota mascota = mascotaMapper.toEntity(mascotaDTORequest);
        mascota = mascotaRepository.save(mascota);

        return MascotaDTOSaveSucces.builder()
                                   .id(mascota.getId())
                                   .nombre(mascota.getNombre())
                                   .familiarId(mascota.getFamiliar().getId())
                                   .build();
    }

    @Transactional
    public MascotaDTOSaveSucces putMascota(Long idMascota, MascotaDTORequest mascotaDTORequest){

        this.getMascotaEntityById(idMascota);
        usuarioService.getUsuarioById(mascotaDTORequest.getFamiliarId());

        Mascota mascota = mascotaMapper.toEntity(mascotaDTORequest, idMascota);

        mascotaRepository.save(mascota);

        return MascotaDTOSaveSucces.builder()
                .id(mascota.getId())
                .nombre(mascota.getNombre())
                .familiarId(mascota.getFamiliar().getId())
                .build();

    }

    public MascotaDTODetail getMascotaById(Long id){

        Mascota mascota = this.getMascotaEntityById(id);

        return mascotaMapper.toDTO(mascota);
    }


    public Mascota getMascotaEntityById(Long id){

        return mascotaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorsEnums.MASCOTA_NOT_FOUND.getDescription() + id));
    }


    public List<MascotaDTODetail> getMascotasByFamiliarId(Long usuarioId){

        usuarioService.getUsuarioById(usuarioId);

        return mascotaRepository.findByFamiliarId(usuarioId)
                                .stream()
                                .map(mascotaMapper::toDTO)
                                .toList();
    }

    @Transactional
    public void deleteCompaniero(Long id) {
        this.getMascotaEntityById(id);
        mascotaRepository.deleteById(id);
    }


    //implementar servicio para declarar a la mascota perdida



}
