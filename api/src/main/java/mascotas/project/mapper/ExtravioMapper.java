package mascotas.project.mapper;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MascotaMapper.class}, imports = Mascota.class)
public interface ExtravioMapper {

    @Mapping(target = "creadoByFamiliar", expression = "java(!animalAnonimo)")
    @Mapping(target = "mascota", source = "dto.mascotaId")
    Extravio toEntity(ExtravioRequestDTO dto, Boolean animalAnonimo);

    @Mapping(target = "id", source = "extravioId")
    @Mapping(target = "mascota", source = "dto.mascotaId")
    Extravio putToEntity(ExtravioRequestDTO dto, Long  extravioId);

    @Mapping(target = "mascotaDetalle", source = "mascotaEntity")
    ExtravioDetailDTO  toDtoDetail(ExtravioDetailDTO extravioDetailDTO, Mascota mascotaEntity);

    @Mapping(target = "mascotaId", source = "mascota")
    ExtravioRequestDTO toDtoRequest(Extravio extravio);
}
