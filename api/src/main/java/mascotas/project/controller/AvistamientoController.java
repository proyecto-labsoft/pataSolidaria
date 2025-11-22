package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.AvistamientoRequestDTO;
import mascotas.project.entities.Avistamiento;
import mascotas.project.services.AvistamientoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/avistamientos")
@AllArgsConstructor
@Slf4j
@Tag(name= "Avistamientos", description = "Servicios relacionados a Avistamientos de Extravios")
public class AvistamientoController {

    private final AvistamientoService avistamientoService;

    @PostMapping(value = "")
    @Operation(
            operationId = "postAvistamiento",
            summary = "Persiste un nuevo avistamiento",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para el nuevo avistamiento")
    )
    public ResponseEntity<Object> publicarAvistamiento (@RequestBody AvistamientoRequestDTO requestDTO){

        Avistamiento avistamiento = avistamientoService.saveAvistamiento(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(avistamiento);
    }


    @GetMapping(value = "/extravio/{id}")
    @Operation(
            operationId = "getAvistamientosByExtravioId",
            summary = "Obtiene listado de avistamientos por ExtravioID",
            parameters = {@Parameter(name="id", description = "Id del extravio", example = "40", required = true)}
    )
    public ResponseEntity<Object> getAvistamientos ( @PathVariable(name = "id", required = true) Long extravioID){

        List<Avistamiento> avistamientos = avistamientoService.getAvistamientosByExtravio(extravioID);

        return ResponseEntity.status(HttpStatus.OK).body(avistamientos);
    }
}
