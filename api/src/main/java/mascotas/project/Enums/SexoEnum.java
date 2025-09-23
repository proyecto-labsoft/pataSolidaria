package mascotas.project.Enums;

public enum SexoEnum {

    M(0, "Macho"),
    H(1, "Hembra");

    public long id;
    public String descripcion;

    SexoEnum(long id, String descripcion) {
        this.id = id;
        this.descripcion = descripcion;
    }
}
