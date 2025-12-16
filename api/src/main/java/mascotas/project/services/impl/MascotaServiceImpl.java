package mascotas.project.services.impl;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.MascotaDTODetail;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.BadRequestException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.MascotaMapper;
import mascotas.project.repositories.MascotaRepository;
import mascotas.project.services.interfaces.MascotaService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class MascotaServiceImpl implements MascotaService {

    private final MascotaRepository mascotaRepository;
    private final UsuarioService usuarioService;
    private final MascotaMapper mascotaMapper;


    @Override
    @Transactional
    public MascotaDTOSaveSucces saveMascota(MascotaDTORequest mascotaDTORequest){

        // Validar campos obligatorios
        validateMascotaRequiredFields(mascotaDTORequest);

        usuarioService.getUsuarioById(mascotaDTORequest.getFamiliarId());

        Mascota mascota = mascotaMapper.toEntity(mascotaDTORequest);
        mascota = mascotaRepository.save(mascota);

        return MascotaDTOSaveSucces.builder()
                                   .id(mascota.getId())
                                   .nombre(mascota.getNombre())
                                   .familiarId(mascota.getFamiliar().getId())
                                   .build();
    }

    @Override
    @Transactional
    public MascotaDTOSaveSucces saveMascotaSinFamiliar(MascotaDTORequest mascotaDTORequest){

        Mascota mascota = mascotaMapper.toAnonimousEntity(mascotaDTORequest);
        mascota = mascotaRepository.save(mascota);

        log.info("SAVE_MASCOTA_SIN_FAMILIAR: mascota ID: {}", mascota.getId());

        return MascotaDTOSaveSucces.builder()
                .id(mascota.getId())
                .nombre(mascota.getNombre())
                .build();
    }

    @Override
    @Transactional
    public MascotaDTOSaveSucces putMascota(Long idMascota, MascotaDTORequest mascotaDTORequest){

        // Validar campos obligatorios
        validateMascotaRequiredFields(mascotaDTORequest);

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

    @Override
    public MascotaDTODetail getMascotaById(Long id){

        Mascota mascota = this.getMascotaEntityById(id);

        return mascotaMapper.toDTO(mascota);
    }

    @Override
    public Mascota getMascotaEntityById(Long id){

        return mascotaRepository.findById(id)
                .orElseThrow(() -> new NoContentException(ErrorsEnums.MASCOTA_NOT_FOUND.getDescription() + id));
    }


    @Override
    public List<MascotaDTODetail> getMascotasByFamiliarId(Long usuarioId){

        usuarioService.getUsuarioById(usuarioId);

        return mascotaRepository.findByFamiliarId(usuarioId)
                                .stream()
                                .map(mascotaMapper::toDTO)
                                .toList();
    }

    @Override
    @Transactional
    public void deleteCompaniero(Long id) {
        this.getMascotaEntityById(id);
        mascotaRepository.deleteById(id);
    }



    ///  METODOS HELPERS ///

    private void validateMascotaRequiredFields(MascotaDTORequest mascotaDTORequest) {
        if (mascotaDTORequest.getNombre() == null || mascotaDTORequest.getNombre().trim().isEmpty()) {
            throw new BadRequestException(ErrorsEnums.MASCOTA_NOMBRE_REQUIRED.getDescription());
        }
        if (mascotaDTORequest.getEspecie() == null || mascotaDTORequest.getEspecie().trim().isEmpty()) {
            throw new BadRequestException(ErrorsEnums.MASCOTA_ESPECIE_REQUIRED.getDescription());
        }
        if (mascotaDTORequest.getRaza() == null || mascotaDTORequest.getRaza().trim().isEmpty()) {
            throw new BadRequestException(ErrorsEnums.MASCOTA_RAZA_REQUIRED.getDescription());
        }
        if (mascotaDTORequest.getSexo() == null) {
            throw new BadRequestException(ErrorsEnums.MASCOTA_SEXO_REQUIRED.getDescription());
        }
        if (mascotaDTORequest.getTamanio() == null) {
            throw new BadRequestException(ErrorsEnums.MASCOTA_TAMANIO_REQUIRED.getDescription());
        }
        if (mascotaDTORequest.getFamiliarId() == null) {
            throw new BadRequestException(ErrorsEnums.MASCOTA_FAMILIAR_REQUIRED.getDescription());
        }
    }



}
