package mascotas.project.mapper;

import mascotas.project.dto.ImagenDTO;
import mascotas.project.dto.ImagenUploadResponseDTO;
import mascotas.project.entities.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ImagenMapper {

    // Mapeo desde MascotaImagen a DTO
    @Mapping(target = "id", source = "imagen.id")
    @Mapping(target = "nombreArchivo", source = "imagen.nombreArchivo")
    @Mapping(target = "rutaStorage", source = "imagen.rutaStorage")
    @Mapping(target = "urlPublica", source = "imagen.urlPublica")
    @Mapping(target = "tipoMime", source = "imagen.tipoMime")
    @Mapping(target = "tamanio", source = "imagen.tamanio")
    @Mapping(target = "fechaSubida", source = "imagen.fechaSubida")
    @Mapping(target = "orden", source = "orden")
    ImagenDTO toDTO(MascotaImagen mascotaImagen);

    // Mapeo desde ExtravioImagen a DTO
    @Mapping(target = "id", source = "imagen.id")
    @Mapping(target = "nombreArchivo", source = "imagen.nombreArchivo")
    @Mapping(target = "rutaStorage", source = "imagen.rutaStorage")
    @Mapping(target = "urlPublica", source = "imagen.urlPublica")
    @Mapping(target = "tipoMime", source = "imagen.tipoMime")
    @Mapping(target = "tamanio", source = "imagen.tamanio")
    @Mapping(target = "fechaSubida", source = "imagen.fechaSubida")
    @Mapping(target = "orden", source = "orden")
    ImagenDTO toDTO(ExtravioImagen extravioImagen);

    // Mapeo desde AvistamientoImagen a DTO
    @Mapping(target = "id", source = "imagen.id")
    @Mapping(target = "nombreArchivo", source = "imagen.nombreArchivo")
    @Mapping(target = "rutaStorage", source = "imagen.rutaStorage")
    @Mapping(target = "urlPublica", source = "imagen.urlPublica")
    @Mapping(target = "tipoMime", source = "imagen.tipoMime")
    @Mapping(target = "tamanio", source = "imagen.tamanio")
    @Mapping(target = "fechaSubida", source = "imagen.fechaSubida")
    @Mapping(target = "orden", source = "orden")
    ImagenDTO toDTO(AvistamientoImagen avistamientoImagen);

    // Mapeo desde AdopcionImagen a DTO
    @Mapping(target = "id", source = "imagen.id")
    @Mapping(target = "nombreArchivo", source = "imagen.nombreArchivo")
    @Mapping(target = "rutaStorage", source = "imagen.rutaStorage")
    @Mapping(target = "urlPublica", source = "imagen.urlPublica")
    @Mapping(target = "tipoMime", source = "imagen.tipoMime")
    @Mapping(target = "tamanio", source = "imagen.tamanio")
    @Mapping(target = "fechaSubida", source = "imagen.fechaSubida")
    @Mapping(target = "orden", source = "orden")
    ImagenDTO toDTO(AdopcionImagen adopcionImagen);

    // Helper para crear ImagenUploadResponseDTO
    @Mapping(target = "imagenId", source = "id")
    @Mapping(target = "mensaje", constant = "Imagen subida exitosamente")
    ImagenUploadResponseDTO toUploadResponse(Imagen imagen);
}
