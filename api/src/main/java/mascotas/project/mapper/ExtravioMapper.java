package mascotas.project.mapper;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MascotaMapper.class}, imports = Mascota.class)
public interface ExtravioMapper {

    @Mapping(target = "mascota", source = "mascotaId")
    @Mapping(target = "latitud", source = "latitud")
    @Mapping(target = "longitud", source = "longitud")
    @Mapping(target = "direccion", source = "direccion")
    Extravio toEntity(ExtravioRequestDTO dto);

    @Mapping(target = "id", source = "extravioId")
    @Mapping(target = "mascota", source = "dto.mascotaId")
    Extravio putToEntity(ExtravioRequestDTO dto, Long  extravioId);

    @Mapping(target = "mascotaDetalle", source = "mascotaEntity")
    ExtravioDetailDTO  toDtoDetail(ExtravioDetailDTO extravioDetailDTO, Mascota mascotaEntity);

}
