package mascotas.project.mapper;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.ExtravioResponseDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;
import java.util.List;

@Mapper(componentModel = "spring", uses = {MascotaMapper.class}, imports = Mascota.class)
public interface ExtravioMapper {

    @Mapping(target = "creadoByFamiliar", expression = "java(!animalAnonimo)")
    @Mapping(target = "mascota", source = "dto.mascotaId")
    @Mapping(target = "ultimoAvistamiento", source = "dto.hora")
    Extravio toEntity(ExtravioRequestDTO dto, Boolean animalAnonimo);

    @Mapping(target = "id", source = "extravioId")
    @Mapping(target = "mascota", source = "dto.mascotaId")
    @Mapping(target = "creadoByFamiliar", source = "creadoByFamiliar")
    @Mapping(target = "ultimoAvistamiento", source = "dto.hora")
    Extravio putToEntity(ExtravioRequestDTO dto, Long  extravioId, Boolean creadoByFamiliar);

    @Mapping(target = "mascotaDetalle", source = "mascotaEntity")
    ExtravioDetailDTO  toDtoDetail(ExtravioDetailDTO extravioDetailDTO, Mascota mascotaEntity);


    @Mapping(target ="mascotaDetalle" , ignore = true)
    @Mapping(target = "extravioId", source="id")
    @Mapping(target = "creadorId", source="creador")
    @Mapping(target = "mascotaId", source="mascota")
    ExtravioDetailDTO toExtravioDetailDTO(Extravio extravioEntiry);

    List<ExtravioDetailDTO> toExtravioDetailDTOList(List<Extravio> extravioEntiry);


    @Mapping(target = "mascotaId", source = "mascota")
    ExtravioResponseDTO toDtoResponse(Extravio extravio);


}
