package mascotas.project.controller;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.MascotaDTODetalle;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.services.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mascotas")
@Slf4j
@AllArgsConstructor
public class MascotaController {

    private MascotaService mascotaService;

    @PostMapping
    public ResponseEntity<MascotaDTOSaveSucces> saveMascota(@RequestBody MascotaDTORequest mascotaDTORequest) throws ChangeSetPersister.NotFoundException {
        MascotaDTOSaveSucces mascota = mascotaService.saveMascota(mascotaDTORequest);
        return  ResponseEntity.ok().body(mascota);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<MascotaDTOSaveSucces> editMascota(@RequestBody MascotaDTORequest mascotaDTORequest) throws ChangeSetPersister.NotFoundException {
        MascotaDTOSaveSucces mascota = mascotaService.saveMascota(mascotaDTORequest);
        return  ResponseEntity.ok().body(mascota);
    }


    @GetMapping(value = "/{id}")
    public ResponseEntity<MascotaDTODetalle> getMascotabyID(@PathVariable(name="id", required = true) Long idMascota) throws ChangeSetPersister.NotFoundException {
        MascotaDTODetalle mascota = mascotaService.getMascotaById(idMascota);
        return ResponseEntity.ok().body(mascota);
    }

    @GetMapping(value = "/user/{userId}")
    public ResponseEntity<List<MascotaDTODetalle>> getMascotasByFamiliarId(@PathVariable(name="userId", required = true) Long idUser) throws ChangeSetPersister.NotFoundException {
        List<MascotaDTODetalle> mascota = mascotaService.getMascotasByFamiliarId(idUser);
        return ResponseEntity.ok().body(mascota);
    }

}
