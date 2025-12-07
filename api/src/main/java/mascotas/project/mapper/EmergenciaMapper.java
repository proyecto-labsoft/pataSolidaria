package mascotas.project.mapper;


import mascotas.project.dto.AdopcionDetailDTO;
import mascotas.project.dto.EmergenciaDetailDTO;
import mascotas.project.dto.EmergenciaRequestDTO;
import mascotas.project.entities.Adopcion;
import mascotas.project.entities.Emergencia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = UsuarioMapper.class)
public interface EmergenciaMapper {

    @Mapping(target = "usuarioCreador", source = "creador", qualifiedByName = "toUsuarioDtoDetail")
    EmergenciaDetailDTO toDetailDto (Emergencia adopcionEntity);

    List<EmergenciaDetailDTO> toDetailDtoList (List <Emergencia> emergenciaEntityList);


    @Mapping(target = "id", ignore = true)
    @Mapping(target ="creador.id",  source = "emergenciaRequest.usuarioId")
    Emergencia toEntity(EmergenciaRequestDTO emergenciaRequest);


    @Mapping(target = "id", source = "id")
    @Mapping(target ="creador.id",  source = "emergenciaRequest.usuarioId")
    @Mapping(target ="creador.mascotas",  ignore = true)
    Emergencia putToEntity(EmergenciaRequestDTO emergenciaRequest, Long id);

}