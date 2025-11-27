package mascotas.project.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.PerdidoDTO;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.entities.Mascota;
import mascotas.project.exceptions.ForbiddenException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.exceptions.NotFoundException;
import mascotas.project.mapper.ExtravioMapper;
import mascotas.project.repositories.ExtravioRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class ExtravioService {

    private UsuarioService usuarioService;
    private MascotaService mascotaService;
    private ExtravioMapper extravioMapper;
    private ExtravioRepository extravioRepository;

    @Transactional
    public void saveExtravio(ExtravioRequestDTO extravioDto, Boolean animalAnonimo) {

        Optional.of(extravioDto)
                .map(
                    extravioDTO -> {
                            //busco la mascota
                            mascotaService.getMascotaEntityById(extravioDTO.getMascotaId());
                            //busco el usuario
                            usuarioService.getUsuarioById(extravioDTO.getCreador());

                           return extravioMapper.toEntity(extravioDto, animalAnonimo); //mapeo el dto
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

    public List<ExtravioDetailDTO> getAllExtraviosByUsuario(Long  usuarioId, Boolean resueltos){

        usuarioService.getUsuarioById(usuarioId);

        List<ExtravioDetailDTO> extraviosDtos = Optional.ofNullable(resueltos)
                                                                .map(r -> extravioRepository.findAllByCreadorAndResuelto(usuarioId, r) )
                                                                .orElseGet(() -> extravioRepository.findAllByCreador(usuarioId));

        return setMascotaDetailToExtravioDtoList(extraviosDtos);
    }

    public List<ExtravioDetailDTO> getAllExtravios(Boolean resueltos) {

        List<ExtravioDetailDTO> extraviosDtos = Optional.of(resueltos)
                                               .map(extravioRepository::findAllByResuelto)
                                                .orElseThrow(
                                                        ()-> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription())
                                                );


        return setMascotaDetailToExtravioDtoList(extraviosDtos);
    }

    @Transactional
    public Extravio putExtravio( Long extravioId , ExtravioRequestDTO extravioRequest){

        Extravio extravio = this.getExtravioEntityById(extravioId);
        UsuarioDTO usuario = usuarioService.getUsuarioById(extravioRequest.getCreador());
        mascotaService.getMascotaById(extravioRequest.getMascotaId());

        if (!isCreador(extravio, usuario.getId())) {
            throw new ForbiddenException(ErrorsEnums.EXTRAVIO_FORBIDDEN_ERROR.getDescription() + extravio.getId());
        }

        extravio = extravioMapper.putToEntity(extravioRequest, extravioId);

        return extravioRepository.save(extravio);
    }


    @Transactional
    public void deleteExtravio( Long extravioId, Long usuarioId){

        Extravio extravio = this.getExtravioEntityById(extravioId);
        usuarioService.getUsuarioById(usuarioId);

        if (!isCreador(extravio, usuarioId)) {
            throw new ForbiddenException(ErrorsEnums.EXTRAVIO_FORBIDDEN_ERROR.getDescription() + extravio.getId());
        }
        extravioRepository.delete(extravio);
    }

    private Boolean isCreador(Extravio extravio, Long usuarioId){
        return extravio.getCreador().equals(usuarioId);
    }

    public Extravio getExtravioEntityById(Long id){
        return extravioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorsEnums.EXTRAVIO_NOT_FOUND_ERROR.getDescription() + id));
    }


    public PerdidoDTO getExtravioByMascotaId(Long mascotaId){

        mascotaService.getMascotaEntityById(mascotaId);
        Optional<Extravio> extravio = extravioRepository.findByMascotaAndResueltoIsFalse(mascotaId); //busca el extravio abierto

        if (extravio.isPresent()){
            return PerdidoDTO.builder()
                    .extravioId(extravio.get().getId())
                    .estaExtraviado(Boolean.TRUE).build();
        }

        return  PerdidoDTO.builder()
                .extravioId(null)
                .estaExtraviado(Boolean.FALSE).build();
    }


    private List<ExtravioDetailDTO> setMascotaDetailToExtravioDtoList(List<ExtravioDetailDTO> extravioDtos){

        return extravioDtos.stream()
                            .map(extravioDTO -> {
                                Mascota mascotaEntity = mascotaService.getMascotaEntityById(extravioDTO.getMascotaId());
                                return extravioMapper.toDtoDetail(extravioDTO, mascotaEntity);
                            })
                            .collect(Collectors.toList());

    }

}
