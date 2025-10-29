package mascotas.project.Enums;

import lombok.Getter;

@Getter
public enum ErrorsEnums {

    MASCOTA_NOT_FOUND(0, "No se encontró a la MASCOTA con ID: "),
    MASCOTA_NOMBRE_REQUIRED(0, "El nombre de la mascota es obligatorio"),
    MASCOTA_ESPECIE_REQUIRED(0, "La especie de la mascota es obligatoria"),
    MASCOTA_RAZA_REQUIRED(0, "La raza de la mascota es obligatoria"),
    MASCOTA_SEXO_REQUIRED(0, "El sexo de la mascota es obligatorio"),
    MASCOTA_TAMANIO_REQUIRED(0, "El tamaño de la mascota es obligatorio"),
    MASCOTA_FAMILIAR_REQUIRED(0, "El familiar de la mascota es obligatorio"),

    EXTRAVIO_NOT_FOUND_ERROR(0, "No se encontró el EXTRAVIO con ID: "),
    EXTRAVIO_FORBIDDEN_ERROR(0, "El usuario no es CREADOR del extravio con ID: "),

    USUARIO_NOT_FOUND_ERROR(1, "No se encontró al USUARIO con ID: "),

    ADOPCION_NOT_FOUND_ERROR(4, "No se encontró la adopcion con ID: "),

    NO_FAMILIAR_ERROR(2, "El publicador no es familiar de la mascota con ID: "),
    BODY_NOT_NULL_ERROR(3, "El body del request no puede ser Nulo"),
    PARAM_NOT_NULL_ERROR(7, "Los parametros del request no pueden ser Nulos"),
    NO_CONTENT_ERROR(5, "No hay contenido de respuesta para la request"),
    INVALID_ENUM_CONTENT_ERROR(6, "Valor del Enum invalido en la request: ");

    private long id;
    private String description;

    ErrorsEnums(long id, String description) {
        this.id = id;
        this.description = description;
    }
}
