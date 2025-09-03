package mascotas.project.controller;

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
public class ExtravioController {

    private ExtravioService extravioService;

    @PostMapping(value = "")
    public ResponseEntity<Object> publicarExtravio (@RequestBody ExtravioRequestDTO extravioDTO){

        extravioService.saveExtravio(extravioDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @GetMapping(value = "/user/{id}")
    public ResponseEntity<Object> extraviosPorIdUsuario (@PathVariable(name = "id", required = true) Long usuarioId){

        List<ExtravioDetailDTO> extravios = extravioService.getAllExtraviosByUsuario(usuarioId);

        return ResponseEntity.status(HttpStatus.CREATED).body(extravios);
    }

    @GetMapping
    public ResponseEntity<List<ExtravioDetailDTO>> getExtravios( @RequestParam(name = "resueltos", required = false) Boolean resueltos) {

        List<ExtravioDetailDTO> extravios = extravioService.getAllExtravios(resueltos);
        return ResponseEntity.status(HttpStatus.OK).body(extravios);
    }
}
