package mascotas.project.dto;


import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class MascotaDTOSaveSucces {

    private Long id;
    private String nombre;
    private Long familiarId;

}
