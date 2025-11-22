package mascotas.project.mapper;

import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import org.hibernate.annotations.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AvistamientoMapper {

    @Mapping(target = "id", ignore = true)
    Avistamiento toEntity(AvistamientoRequestDTO requestDTO);
}
