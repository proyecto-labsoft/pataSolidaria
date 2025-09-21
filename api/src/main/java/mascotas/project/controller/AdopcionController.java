package mascotas.project.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.AdopcionDTO;
import mascotas.project.entities.Adopcion;
import mascotas.project.services.AdopcionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/adopciones")
@AllArgsConstructor
@Tag(name= "Adopciones", description = "Servicios relacionados a Adopciones")
public class AdopcionController {

    private AdopcionService adopcionService;

    @PostMapping
    @Operation(
            operationId = "saveAdpopcion",
            summary = "Persiste una nueva adopcion",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para la nueva adopcion")
    )
    public ResponseEntity<Adopcion> saveAdopcion(@RequestBody AdopcionDTO mascotaDTORequest){
        Adopcion adopcion = adopcionService.saveAdopcion(mascotaDTORequest);
        return  ResponseEntity.ok().body(adopcion);
    }

    @GetMapping
    @Operation(
            operationId = "getAllAdopciones",
            summary = "Obtiene todas las Adopciones disponibles"
    )
    public ResponseEntity<Object> getAllAdopciones(){

        List<AdopcionDTO> adopciones = adopcionService.getAdopciones();

        return  ResponseEntity.ok().body(adopciones);
    }
}
