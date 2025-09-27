package mascotas.project.Enums;

import lombok.Getter;

@Getter
public enum TamanioEnum {

    PEQUENIO(0,"Pequeño"),
    MEDIANO(1, "Mediano"),
    GRANDE(2, "Grande"),
    GIGANTE(3, "Gigante");

    private long id;
    private String descripcion;

    TamanioEnum(long id, String descripcion) {
        this.id = id;
        this.descripcion = descripcion;
    }
}
