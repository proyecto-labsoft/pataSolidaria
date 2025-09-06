package mascotas.project.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/usuarios")
@Slf4j
@AllArgsConstructor
public class UsuarioController {

    private UsuarioService usuarioService;

    @GetMapping(value = "/{id}")
    public ResponseEntity<UsuarioDTO> getUsuariobyID(@PathVariable(name = "id", required = true) Long idUsuario){
        UsuarioDTO mascota = usuarioService.getUsuarioById(idUsuario);
        return ResponseEntity.ok().body(mascota);
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO createdUsuario = usuarioService.createUsuario(usuarioDTO);
        return ResponseEntity.ok().body(createdUsuario);
    }

}