package mascotas.project.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.PostulacionDTO;
import mascotas.project.entities.Postulacion;
import mascotas.project.services.PostulacionService;
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
public class PostulacionController {

    private final PostulacionService postulacionService;

    @PostMapping()
    public ResponseEntity<Postulacion> savePostulacion(@RequestBody PostulacionDTO postulacionRequest){

        Postulacion postulacion = postulacionService.savePostulacion(postulacionRequest);
        return  ResponseEntity.ok().body(postulacion);
    }

    @GetMapping(value =  "/{id}")
    public ResponseEntity<List<PostulacionDTO>> postualcionesByUsuarioId(@PathVariable(name = "id", required = true) Long idUsuario){

        List<PostulacionDTO> postulaciones = postulacionService.getAllPostulacionesByUsuario(idUsuario);

        return  ResponseEntity.ok().body(postulaciones);
    }
}
