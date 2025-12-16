package mascotas.project.mapper;

import mascotas.project.dto.EmergenciaDetailDTO;
import mascotas.project.dto.EmergenciaRequestDTO;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.entities.Emergencia;
import mascotas.project.entities.Mascota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UsuarioMapper.class, MascotaMapper.class}, imports = Mascota.class)
public interface EmergenciaMapper {

    @Mapping(target = "mascotaDetalle", source = "mascota")
    @Mapping(target = "usuarioCreador", source = "creador", qualifiedByName = "toUsuarioDtoDetail")
    EmergenciaDetailDTO toDetailDto (Emergencia adopcionEntity);

    List<EmergenciaDetailDTO> toDetailDtoList (List <Emergencia> emergenciaEntityList);


    @Mapping(target = "id", ignore = true)
    @Mapping(target ="creador.id",  source = "emergenciaRequest.usuarioId")
    @Mapping(target ="mascota.id",  source = "mascota.id")
    Emergencia toEntity(EmergenciaRequestDTO emergenciaRequest, MascotaDTOSaveSucces mascota);


    @Mapping(target = "id", source = "id")
    @Mapping(target ="creador.id",  source = "emergenciaRequest.usuarioId")
    @Mapping(target ="creador.mascotas",  ignore = true)
    Emergencia putToEntity(EmergenciaRequestDTO emergenciaRequest, Long id);

}