package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.PerdidoDTO;
import mascotas.project.dto.PerdidoSinFamiliarDTO;
import mascotas.project.entities.Extravio;
import mascotas.project.services.ExtravioService;
import mascotas.project.services.PerdidosAnonimosService;
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
@RequestMapping("/extravios")
@AllArgsConstructor
@Slf4j
@Tag(name= "Extravios", description = "Servicios relacionados a Extravios para animales con Familiares")
public class ExtravioController {

    private ExtravioService extravioService;
    private PerdidosAnonimosService perdidosAnonimosService;

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


    @PostMapping(value = "sin-familiar")
    @Operation(
            operationId = "postExtravioSinFamiliar",
            summary = "Persiste un nuevo extravio",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para el nuevo extravio sin familiar")
    )
    public ResponseEntity<Object> publicarExtravio(@RequestBody PerdidoSinFamiliarDTO perdidoAnonimoDto) {

        perdidosAnonimosService.savePerdidosAnonimos(perdidoAnonimoDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @GetMapping(value = "/user/{id}")
    @Operation(
            operationId = "extraviosByUsuario",
            summary = "Extravios publicados por un usuario especifico filtrado por resueltos",
            parameters = {@Parameter(name="id", description = "Id del usuario", example = "1", required = true)}
    )
    public ResponseEntity<Object> extraviosPorIdUsuario (@PathVariable(name = "id", required = true) Long usuarioId, @RequestParam(name = "resueltos", required = false) Boolean resueltos){

        List<ExtravioDetailDTO> extravios = extravioService.getAllExtraviosByUsuario(usuarioId, resueltos);

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

    @PutMapping(value = "/{id}")
    @Operation(
            operationId = "putExtravio",
            summary = "Modifica un extravio existente",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos del extravio a modificar"),
            parameters = {@Parameter(name="id", description = "Id del extravio", example = "1", required = true)}
    )
    public ResponseEntity<Extravio> editExtravio(@PathVariable(name="id", required = true) Long id ,
                                                 @RequestBody ExtravioRequestDTO extravioDTORequest){

        Extravio extravio = extravioService.putExtravio(id, extravioDTORequest);
        return  ResponseEntity.ok().body(extravio);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            operationId = "deleteExtravio",
            summary = "Elimina un extravio existente",
            parameters = {@Parameter(name="id", description = "Id del extravio a eliminar", example = "1", required = true),
                    @Parameter(name="usuarioId", description = "Id del usuario que realiza la acción", example = "2")
            }
    )
    public ResponseEntity<Void> deleteExtravio (@PathVariable(name="id", required = true) Long id ,
                                                @RequestParam(name="usuarioId", required = true) Long usuarioId){
        extravioService.deleteExtravio(id, usuarioId);
        return  ResponseEntity.ok().build();
    }


    @GetMapping(value = "/mascota/{id}")
    @Operation(
            operationId = "getCompanieroPerdido",
            summary = "Obtiene si esta extraviado o no una mascota",
            parameters = {@Parameter(name="id", description = "Id de la mascota", example = "1", required = true)}
    )
    public ResponseEntity<PerdidoDTO> getMascotaPerdido(@PathVariable(name="id", required = true) Long mascotaId){

        PerdidoDTO perdido = extravioService.getExtravioByMascotaId(mascotaId);
        return ResponseEntity.ok().body(perdido);
    }
}
