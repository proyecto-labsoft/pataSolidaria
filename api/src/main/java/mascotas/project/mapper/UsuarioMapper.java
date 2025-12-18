package mascotas.project.mapper;


import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    Usuario toEntity(UsuarioDTO dtoRequest);
    UsuarioDTO toUsuarioDto(Usuario enitity);


    @Named("toUsuarioDtoDetail")
    @Mapping(target = "id" , source = "entity.id")
    @Mapping(target = "direccion" , ignore = true)
    @Mapping(target = "administrador" , ignore = true)
    UsuarioDTO toUsuarioDtoDetail(Usuario entity);
}
