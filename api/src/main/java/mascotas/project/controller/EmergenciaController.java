package mascotas.project.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.EmergenciaAnimalAnonimoDTO;
import mascotas.project.dto.EmergenciaRequestDTO;
import mascotas.project.dto.EmergenciaDetailDTO;
import mascotas.project.entities.Emergencia;
import mascotas.project.services.interfaces.EmergenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/emergencias")
@AllArgsConstructor
@Slf4j
@Tag(name= "Emergencias", description = "Servicios relacionados a Emergencias")
public class EmergenciaController {

    private final EmergenciaService emergenciaService;

    @PostMapping(value = "")
    @Operation(
            operationId = "postEmergencia",
            summary = "Persiste un nuevo emergencia",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para el nuevo emergencia")
    )
    public ResponseEntity<Object> publicarEmergencia (@RequestBody EmergenciaAnimalAnonimoDTO request){

        emergenciaService.saveEmergenciaAnimalAnonimo(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @GetMapping
    @Operation(
            operationId = "getEmergencias",
            summary = "Listado de Emergencias filtrados",
            parameters = {@Parameter(name="atendidos", description = "Emergencias atendidos o no", required = false)}
    )
    public ResponseEntity<List<EmergenciaDetailDTO>> getEmergencias(@RequestParam(name = "atendidos", required = false) Boolean atendidos) {

        List<EmergenciaDetailDTO> emergencias = emergenciaService.getAllEmergencias(atendidos);
        return ResponseEntity.status(HttpStatus.OK).body(emergencias);
    }


    @PutMapping(value = "/{id}")
    @Operation(
            operationId = "putEmergencia",
            summary = "Modifica una emergencia existente",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos del emergencia a modificar"),
            parameters = {@Parameter(name="id", description = "Id de la emergencia", example = "1", required = true)}
    )
    public ResponseEntity<Emergencia> editEmergencia(@PathVariable(name="id", required = true) Long id ,
                                                 @RequestBody EmergenciaRequestDTO emergenciaDTORequest){

        Emergencia emergencia = emergenciaService.putEmergencia(emergenciaDTORequest, id);
        return  ResponseEntity.ok().body(emergencia);
    }


    @GetMapping(value = "/{id}")
    @Operation(
            operationId = "getEmergencia",
            summary = "Obtiene una emergencia existente",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos del emergencia a modificar"),
            parameters = {@Parameter(name="id", description = "Id de la emergencia", example = "1", required = true)}
    )
    public ResponseEntity<EmergenciaDetailDTO> editEmergencia(@PathVariable(name="id", required = true) Long id ){

        EmergenciaDetailDTO emergencia = emergenciaService.getEmergenciaById(id);

        return  ResponseEntity.ok().body(emergencia);
    }



    @DeleteMapping(value = "/{id}")
    @Operation(
            operationId = "deleteEmergencia",
            summary = "Elimina un emergencia existente",
            parameters = {@Parameter(name="id", description = "Id del emergencia a eliminar", example = "1", required = true),
                    @Parameter(name="usuarioId", description = "Id del usuario que realiza la acción", example = "2")
            }
    )
    public ResponseEntity<Void> deleteEmergencia (@PathVariable(name="id", required = true) Long id ,
                                                @RequestParam(name="usuarioId", required = true) Long usuarioId){

        emergenciaService.deleteEmergencia(id, usuarioId);
        return  ResponseEntity.ok().build();
    }


}
