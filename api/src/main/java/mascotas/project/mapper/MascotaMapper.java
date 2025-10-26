package mascotas.project.mapper;

import mascotas.project.dto.MascotaDTODetail;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MascotaMapper {

    @Mapping(target = "familiar.id", source = "familiarId")
    Mascota toEntity(MascotaDTORequest dtoRequest);

    @Mapping(target = "familiar", ignore = true)
    Mascota toAnonimousEntity(MascotaDTORequest dtoRequest);

    @Mapping(target = "familiar.id", source = "dtoRequest.familiarId")
    @Mapping(target = "id", source = "idMascota")
    Mascota toEntity(MascotaDTORequest dtoRequest, Long idMascota);

    MascotaDTODetail toDTO(Mascota mascota);
}
