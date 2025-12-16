package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.AdopcionRequestDTO;
import mascotas.project.dto.AdopcionDetailDTO;
import mascotas.project.services.interfaces.AdopcionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/adopciones")
@AllArgsConstructor
@Tag(name= "Adopciones", description = "Servicios relacionados a Adopciones")
public class AdopcionController {

    private final AdopcionService adopcionService;

    @PostMapping
    @Operation(
            operationId = "saveAdpopcion",
            summary = "Persiste una nueva adopcion",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para la nueva adopcion")
    )
    public ResponseEntity<AdopcionDetailDTO> saveAdopcion(@RequestBody AdopcionRequestDTO mascotaDTORequest){
        AdopcionDetailDTO adopcion = adopcionService.saveAdopcion(mascotaDTORequest);
        return  ResponseEntity.ok().body(adopcion);
    }

    @GetMapping
    @Operation(
            operationId = "getAllAdopciones",
            summary = "Obtiene todas las Adopciones disponibles"
    )
    public ResponseEntity<Object> getAllAdopciones(){

        List<AdopcionDetailDTO> adopciones = adopcionService.getAdopciones();

        return  ResponseEntity.ok().body(adopciones);
    }
}
