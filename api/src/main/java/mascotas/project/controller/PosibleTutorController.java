package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.websocket.server.PathParam;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.PosibleTutorDetail;
import mascotas.project.dto.PosibleTutorRequest;
import mascotas.project.entities.PosibleTutor;
import mascotas.project.services.interfaces.PosibleTutorService;
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
@RequestMapping("/posible-tutor")
@AllArgsConstructor
@Slf4j
@Tag(name= "Posible tutor", description = "Servicios relacionados a Posiblres tutores de extravio")
public class PosibleTutorController {

    private final PosibleTutorService posibleTutorService;


    @PostMapping(value = "")
    @Operation(
            operationId = "postPosibleTutor",
            summary = "Persiste un nuevo posible tutor"
    )
    public ResponseEntity<Object> publicarExtravio (@RequestBody PosibleTutorRequest request){

        PosibleTutor posibleTutor = posibleTutorService.savePosibleTutor(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(posibleTutor);
    }

    @GetMapping(value= "/extravio/{extravioId}")
    @Operation(
            operationId = "getPosiblesTutores",
            summary = "Listado de Posibles tutores by extravioId"
    )
    public ResponseEntity<List<PosibleTutorDetail>> getPosiblesTutores(@PathVariable(name = "extravioId", required = true) Long extravioId) {

        List<PosibleTutorDetail> posibleTutoresList = posibleTutorService.getPosiblesTutores(extravioId);

        return ResponseEntity.status(HttpStatus.OK).body(posibleTutoresList);
    }

}
