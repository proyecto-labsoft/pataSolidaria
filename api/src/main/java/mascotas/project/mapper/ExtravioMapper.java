package mascotas.project.mapper;

import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = Mascota.class)
public interface ExtravioMapper {

    @Mapping(target = "mascota", source = "mascotaId")
    @Mapping(target = "atencion_medica", source ="atencionMedica")
    @Mapping(target = "tiempo_gracia", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "resuelto", ignore = true)
    @Mapping(target = "latitud", source = "latitud")
    @Mapping(target = "longitud", source = "longitud")
    @Mapping(target = "direccion", source = "direccion")
    Extravio toEntity(ExtravioRequestDTO dto);

}
