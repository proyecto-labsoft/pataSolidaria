package mascotas.project.mapper;

import mascotas.project.dto.PostulacionDetailDTO;
import mascotas.project.dto.PostulacionRequestDTO;
import mascotas.project.entities.Postulacion;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring",  uses = {UsuarioMapper.class})
public interface PostulacionMapper {


    @Mapping(target="usuario.id", source="usuarioId")
    @Mapping(target="adopcion.id", source="adopcionId")
    @Mapping(target="fecha", source= "fecha")
    Postulacion toPostulacionEntity(PostulacionRequestDTO postulacion);


    @Mapping(target="id", source="postulacion.id")
    @Mapping(target="adopcionId", source="postulacion.adopcion.id")
    @Mapping(target="fecha", source="postulacion.fecha")
    @Mapping(target = "usuarioPostulante", source = "usuario", qualifiedByName = "toUsuarioDtoDetail")
    PostulacionDetailDTO toPostulacionDTO(Postulacion postulacion);

    //@IterableMapping(elementTargetType = PostulacionRequestDTO.class)
    List<PostulacionDetailDTO> toPostulacionDTOList(List<Postulacion> postulaciones);
}
