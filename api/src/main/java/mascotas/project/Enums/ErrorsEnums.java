package mascotas.project.Enums;

import lombok.Getter;

@Getter
public enum ErrorsEnums {

    MASCOTA_NOT_FOUND(0, "No se encontró a la MASCOTA con ID: "),
    USUARIO_NOT_FOUND(1, "No se encontró al USUARIO con ID: "),
    NO_FAMILIAR_ERROR(2, "El publicador no es familiar de la mascota con ID: "),
    BODY_NOT_NULL_ERROR(3, "El body del request no puede ser Nulo"),
    ADOPCION_NOT_FOUND_ERROR(4, "No se encontró la adopcion con ID: "),
    NO_CONTENT_ERROR(5, "No hay contenido de respuesta para la request"),
    INVALID_ENUM_CONTENT_ERROR(6, "Valor del Enum invalido en la request: ");

    private long id;
    private String description;

    ErrorsEnums(long id, String description) {
        this.id = id;
        this.description = description;
    }
}
