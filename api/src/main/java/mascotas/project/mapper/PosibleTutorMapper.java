package mascotas.project.mapper;

import mascotas.project.dto.PosibleTutorDetail;
import mascotas.project.dto.PosibleTutorRequest;
import mascotas.project.entities.Mascota;
import mascotas.project.entities.PosibleTutor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UsuarioMapper.class}, imports = UsuarioMapper.class)
public interface PosibleTutorMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuario.id", source = "usuarioId")
    @Mapping(target = "extravioId", source = "extravioId")
    PosibleTutor toEntity(PosibleTutorRequest request);

    @Mapping(target = "posibleTutor", source = "usuario", qualifiedByName = "toUsuarioDtoDetail")
    PosibleTutorDetail toResponseDetail (PosibleTutor tutor);

    List<PosibleTutorDetail> toResponseDetail (List<PosibleTutor> tutores);

}
