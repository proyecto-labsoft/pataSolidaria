package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.services.ExtravioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/extravios")
@AllArgsConstructor
@Slf4j
@Tag(name= "Extravios", description = "Servicios relacionados a Extravios")
public class ExtravioController {

    private ExtravioService extravioService;

    @PostMapping(value = "")
    @Operation(
            operationId = "postExtravio",
            summary = "Persiste un nuevo extravio",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para el nuevo extravio")
    )
    public ResponseEntity<Object> publicarExtravio (@RequestBody ExtravioRequestDTO extravioDTO){

        extravioService.saveExtravio(extravioDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @GetMapping(value = "/user/{id}")
    @Operation(
            operationId = "extraviosByUsuario",
            summary = "Extravios publicados por un usuario especifico",
            parameters = {@Parameter(name="id", description = "Id del usuario", example = "1", required = true)}
    )
    public ResponseEntity<Object> extraviosPorIdUsuario (@PathVariable(name = "id", required = true) Long usuarioId){

        List<ExtravioDetailDTO> extravios = extravioService.getAllExtraviosByUsuario(usuarioId);

        return ResponseEntity.status(HttpStatus.OK).body(extravios);
    }

    @GetMapping
    @Operation(
            operationId = "getExtravios",
            summary = "Listado de Extravios filtrados",
            parameters = {@Parameter(name="resueltos", description = "Extravios resueltos o no, si no llega es false", required = false)}
    )
    public ResponseEntity<List<ExtravioDetailDTO>> getExtravios( @RequestParam(name = "resueltos", required = false) Boolean resueltos) {

        List<ExtravioDetailDTO> extravios = extravioService.getAllExtravios(resueltos);
        return ResponseEntity.status(HttpStatus.OK).body(extravios);
    }
}
