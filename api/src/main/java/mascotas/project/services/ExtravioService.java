package mascotas.project.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.mapper.ExtravioMapper;
import mascotas.project.repositories.ExtravioRepository;
import mascotas.project.repositories.MascotaRepository;
import mascotas.project.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class ExtravioService {

    private UsuarioRepository usuarioRepository;
    private MascotaRepository mascotaRepository;
    private ExtravioMapper extravioMapper;
    private ExtravioRepository extravioRepository;

    @Transactional
    public void saveExtravio(ExtravioRequestDTO extravioDto) {

        Optional.of(extravioDto)
                .map(
                    extravioDTO -> {
                            //busco la mascota
                            mascotaRepository.findById(extravioDTO.getMascotaId())
                                                .map(
                                                        mascota -> {
                                                            log.info("SAVE_EXTRAVIO :Mascota id {}, nombre {}", mascota.getId(), mascota.getNombre());
                                                            return mascota;
                                                        }
                                                )
                                             .orElseThrow( () -> new IllegalArgumentException("No se encontró la mascota con ID: " + extravioDto.getMascotaId()) );

                            //busco el usuario
                            usuarioRepository.findById(extravioDto.getCreador())
                                                .map(usuario -> {
                                                            log.info("SAVE_EXTRAVIO :Usuario id {}, nombre {}", usuario.getId(), usuario.getNombre());
                                                            return usuario;
                                                        }
                                                )
                                             .orElseThrow( () -> new IllegalArgumentException("No se encontró al usuario con ID: " + extravioDto.getCreador()) );

                           return extravioMapper.toEntity(extravioDto); //mapeo el dto
                    }
                )
                .map(
                        extravioEntity -> {
                            Extravio extravio =  extravioRepository.save(extravioEntity);
                            log.info("SAVE_EXTRAVIO : publicador ID:{} ; mascota ID:{} ; idExtravio:{}" , extravioEntity.getCreador(), extravioEntity.getMascota(), extravio.getId());
                            return extravio;
                        }
                );
    }



    public List<ExtravioDetailDTO> getAllExtraviosByUsuario(Long  usuarioId){

        return Optional.of(usuarioId)
                .map(
                        usuario ->{

                            usuarioRepository.findById(usuario)
                                                .orElseThrow(
                                                        () -> new IllegalArgumentException("No se encontró al usuario con ID: " + usuarioId)
                                                );

                            return extravioRepository.findAllByCreador(usuarioId);
                        }
                )
                .orElseThrow(RuntimeException::new);
    }

    public List<ExtravioDetailDTO> getAllExtravios(Boolean resueltos) {
        return Optional.ofNullable(resueltos)
                       .map(extravioRepository::findAllByResuelto)
                       .orElseGet(extravioRepository::findAllWithMascota);
    }
}
