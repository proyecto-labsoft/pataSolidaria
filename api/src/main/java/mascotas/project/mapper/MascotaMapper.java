package mascotas.project.mapper;

import mascotas.project.dto.MascotaDTODetalle;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MascotaMapper {

    MascotaMapper INSTANCE = Mappers.getMapper(MascotaMapper.class);

    @Mapping(source = "familiarId", target = "familiar.id")
    Mascota toEntity(MascotaDTORequest dtoRequest);

    MascotaDTODetalle toDTO(Mascota mascota);
}
