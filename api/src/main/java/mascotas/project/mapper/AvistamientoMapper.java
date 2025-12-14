package mascotas.project.mapper;

import mascotas.project.dto.AvistamientoDetailDTO;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AvistamientoMapper {

    @Mapping(target = "id", ignore = true)
    Avistamiento toEntity(AvistamientoRequestDTO requestDTO);


    @Mapping(target = "usuarioAvistador", source = "usuarioId")
    AvistamientoDetailDTO toDetail(Avistamiento avistamiento);


    List<AvistamientoDetailDTO> toDetailList(List<Avistamiento> avistamientos);

}
