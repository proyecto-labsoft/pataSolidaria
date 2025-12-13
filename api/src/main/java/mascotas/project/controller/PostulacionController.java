package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.PostulacionRequestDTO;
import mascotas.project.entities.Postulacion;
import mascotas.project.services.interfaces.PostulacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/postulaciones")
@Slf4j
@AllArgsConstructor
@Tag(name= "Postulaciones", description = "Servicios relacionados a Postulaciones de adopciones")
public class PostulacionController {

    private final PostulacionService postulacionService;

    @PostMapping()
    @Operation(
            operationId = "savePostulacion",
            summary = "Persiste una nueva Postulacion",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para la nueva postulacion")
    )
    public ResponseEntity<Postulacion> savePostulacion(@RequestBody PostulacionRequestDTO postulacionRequest){

        Postulacion postulacion = postulacionService.savePostulacion(postulacionRequest);
        return  ResponseEntity.ok().body(postulacion);
    }

    @GetMapping(value =  "/user/{id}")
    @Operation(
            operationId = "postulacionesByUsuario",
            summary = "Postulaciones publicados por un usuario especifico",
            parameters = {@Parameter(name="id", description = "Id del usuario", example = "1", required = true)}
    )
    public ResponseEntity<Object> postualcionesByUsuario(@PathVariable(name = "id", required = true) Long idUsuario){

        List<PostulacionRequestDTO> postulaciones = postulacionService.getAllPostulacionesByUsuario(idUsuario);

        return  ResponseEntity.ok().body(postulaciones);
    }


    @GetMapping(value =  "/adopcion/{id}")
    @Operation(
            operationId = "postulacionesByAdopcion",
            summary = "Postulaciones de una Adopcion particular",
            parameters = {@Parameter(name="id", description = "Id de la adopcion", example = "1", required = true)}
    )
    public ResponseEntity<Object> postualcionesByAdopcion(@PathVariable(name = "id", required = true) Long adopcionId){

        List<PostulacionRequestDTO> postulaciones = postulacionService.getAllPostulacionesByAdopcion(adopcionId);

        return  ResponseEntity.ok().body(postulaciones);
    }
}
