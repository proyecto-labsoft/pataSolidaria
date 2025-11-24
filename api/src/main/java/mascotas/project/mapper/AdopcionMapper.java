package mascotas.project.mapper;

import mascotas.project.dto.AdopcionRequestDTO;
import mascotas.project.dto.AdopcionDetailDTO;
import mascotas.project.entities.Adopcion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = UsuarioMapper.class)
public interface AdopcionMapper {

    @Mapping(target="mascota.id", source="adopcionRequestDTO.mascotaID")
    @Mapping(target="administrador.id", source="adopcionRequestDTO.publicadorID")
    Adopcion toEntity (AdopcionRequestDTO adopcionRequestDTO);


    @Mapping(target = "publicador", source = "administrador", qualifiedByName = "toUsuarioDtoDetail")
    @Mapping(target="mascotaDetalle", source="mascota")
    AdopcionDetailDTO toDetailDto (Adopcion adopcionEntity);

    List<AdopcionDetailDTO> toDetailDtoList (List <Adopcion> adopcionEntityList);
}
