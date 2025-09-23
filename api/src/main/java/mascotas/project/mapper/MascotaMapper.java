package mascotas.project.mapper;

import mascotas.project.dto.MascotaDTODetalle;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MascotaMapper {

    @Mapping(source = "familiarId", target = "familiar.id")
    Mascota toEntity(MascotaDTORequest dtoRequest);

    MascotaDTODetalle toDTO(Mascota mascota);
}
