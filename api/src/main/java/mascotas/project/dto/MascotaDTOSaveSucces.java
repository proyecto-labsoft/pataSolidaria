package mascotas.project.dto;


import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class MascotaDTOSaveSucces {

    private Long id;
    private String nombre;
    private Long familiarId;

}
