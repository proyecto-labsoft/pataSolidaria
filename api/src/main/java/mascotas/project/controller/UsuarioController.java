package mascotas.project.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.services.UsuarioService;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
@Slf4j
@AllArgsConstructor
public class UsuarioController {

    private UsuarioService usuarioService;

    @GetMapping(value = "/{id}")
    public ResponseEntity<UsuarioDTO> getUsuariobyID(@PathVariable(name = "id", required = true) Long idUsuario) throws ChangeSetPersister.NotFoundException {
        UsuarioDTO mascota = usuarioService.getUsuarioById(idUsuario);
        return ResponseEntity.ok().body(mascota);
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO createdUsuario = usuarioService.createUsuario(usuarioDTO);
        return ResponseEntity.ok().body(createdUsuario);
    }

}