package mascotas.project.mapper;

import mascotas.project.dto.AdopcionDTO;
import mascotas.project.dto.AdopcionDetailDTO;
import mascotas.project.entities.Adopcion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdopcionMapper {

    @Mapping(target="mascota.id", source="adopcionDTO.mascotaID")
    @Mapping(target="administrador.id", source="adopcionDTO.publicadorID")
    Adopcion toEntity (AdopcionDTO adopcionDTO);

    @Mapping(target="publicadorID", source="administrador.id")
    @Mapping(target="publicadorContacto", source="administrador.celular")
    @Mapping(target="publicadorNombre", source="administrador.nombre")
    @Mapping(target="mascotaID", source="mascota.id")
    @Mapping(target="nombreCompaniero", source="mascota.nombre")
    @Mapping(target="esterilizado", source="mascota.esterilizado")
    AdopcionDTO toDto (Adopcion adopcionEntity);



    @Mapping(target="publicadorID", source="administrador.id")
    @Mapping(target="publicadorContacto", source="administrador.celular")
    @Mapping(target="publicadorNombre", source="administrador.nombre")
    @Mapping(target="mascotaDetalle", source="adopcionEntity.mascota")
    AdopcionDetailDTO toDetailDto (Adopcion adopcionEntity);
}
