package mascotas.project.controller;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.AdopcionDTO;
import mascotas.project.entities.Adopcion;
import mascotas.project.services.AdopcionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adopciones")
@Slf4j
@AllArgsConstructor
public class AdopcionController {

    private AdopcionService adopcionService;

    @PostMapping
    public ResponseEntity<Adopcion> saveAdopcion(@RequestBody AdopcionDTO mascotaDTORequest){
        Adopcion adopcion = adopcionService.saveAdopcion(mascotaDTORequest);
        return  ResponseEntity.ok().body(adopcion);
    }

    @GetMapping
    public ResponseEntity<List<Adopcion>> getAllAdopciones(){
        List<Adopcion> adopciones = adopcionService.findAll();
        return  ResponseEntity.ok().body(adopciones);
    }
}
