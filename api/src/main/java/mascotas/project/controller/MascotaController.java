package mascotas.project.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.MascotaDTODetail;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.dto.PerdidoDTO;
import mascotas.project.services.MascotaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mascotas")
@Slf4j
@AllArgsConstructor
@Tag(name= "Mascotas", description = "Servicios relacionados a compañeros")
public class MascotaController {

    private MascotaService mascotaService;

    @PostMapping
    @Operation(
            operationId = "saveMascota",
            summary = "Persiste una nueva mascota",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para la nueva mascota")
    )
    public ResponseEntity<MascotaDTOSaveSucces> saveMascota(@RequestBody MascotaDTORequest mascotaDTORequest){
        MascotaDTOSaveSucces mascota = mascotaService.saveMascota(mascotaDTORequest);
        return  ResponseEntity.ok().body(mascota);
    }

    @PutMapping(value = "/{id}")
    @Operation(
            operationId = "putMascota",
            summary = "Modifica una mascota existente",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la mascota a modificar"),
            parameters = {@Parameter(name="id", description = "Id de la mascota", example = "1", required = true)}
    )
    public ResponseEntity<MascotaDTOSaveSucces> editMascota( @PathVariable(name="id", required = true) Long id ,
                                                             @RequestBody MascotaDTORequest mascotaDTORequest){

        MascotaDTOSaveSucces mascota = mascotaService.putMascota(id, mascotaDTORequest);
        return  ResponseEntity.ok().body(mascota);
    }

    @GetMapping(value = "/{id}")
    @Operation(
            operationId = "getMascota",
            summary = "Obtiene mascota existente",
            parameters = {@Parameter(name="id", description = "Id de la mascota", example = "1", required = true)}
    )
    public ResponseEntity<MascotaDTODetail> getMascotabyID(@PathVariable(name="id", required = true) Long idMascota){
        MascotaDTODetail mascota = mascotaService.getMascotaById(idMascota);
        return ResponseEntity.ok().body(mascota);
    }

    @GetMapping(value = "/user/{id}")
    @Operation(
            operationId = "getMascotasByFamiliarId",
            summary = "Obtiene listado de mascotas por usuario ID",
            parameters = {@Parameter(name="id", description = "Id del familiar", example = "1", required = true)}
    )
    public ResponseEntity<List<MascotaDTODetail>> getMascotasByFamiliarId(@PathVariable(name="id", required = true) Long idUser){
        List<MascotaDTODetail> mascota = mascotaService.getMascotasByFamiliarId(idUser);
        return ResponseEntity.ok().body(mascota);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            operationId = "deleteMascota",
            summary = "Elimina una mascota existente",
            parameters = {@Parameter(name="id", description = "Id de la mascota a eliminar", example = "1", required = true)}
    )
    public ResponseEntity<Void> deleteMascota (@PathVariable(name="id", required = true) Long id ){
        mascotaService.deleteCompaniero(id);
        return  ResponseEntity.noContent().build();
    }
}
