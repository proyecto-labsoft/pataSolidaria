package mascotas.project.mapper;

import mascotas.project.dto.PostulacionRequestDTO;
import mascotas.project.entities.Postulacion;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PostulacionMapper {

    @Mapping(target="usuarioId", source="postulacion.usuario.id")
    @Mapping(target="adopcionId", source="postulacion.adopcion.id")
    @Mapping(target="fecha", source="postulacion.fecha")
    PostulacionRequestDTO toPostulacionDTO(Postulacion postulacion);


    @Mapping(target="usuario.id", source="usuarioId")
    @Mapping(target="adopcion.id", source="adopcionId")
    @Mapping(target="fecha", source= "fecha")
    Postulacion toPostulacionEntity(PostulacionRequestDTO postulacion);

    @IterableMapping(elementTargetType = PostulacionRequestDTO.class)
    List<PostulacionRequestDTO> toPostulacionDTOList(List<Postulacion> postulaciones);
}
