package mascotas.project.mapper;

import mascotas.project.dto.PostulacionDTO;
import mascotas.project.entities.Postulacion;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PostulacionMapper {

    @Mapping(target="usuario", source="postulacion.usuario.id")
    @Mapping(target="adopcion", source="postulacion.adopcion.id")
    @Mapping(target="fecha", source="postulacion.fecha")
    PostulacionDTO toPostulacionDTO(Postulacion postulacion);


    @Mapping(target="usuario.id", source="usuario")
    @Mapping(target="adopcion.id", source="adopcion")
    @Mapping(target="fecha", source= "fecha")
    Postulacion toPostulacionEntity(PostulacionDTO postulacion);

    @IterableMapping(elementTargetType = PostulacionDTO.class)
    List<PostulacionDTO> toPostulacionDTOList(List<Postulacion> postulaciones);
}
