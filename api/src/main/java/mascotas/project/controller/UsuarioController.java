package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name= "Usuarios", description = "Servicios relacionados a Usuarios")
public class UsuarioController {

    private UsuarioService usuarioService;

    @GetMapping(value = "/{id}")
    @Operation(
            operationId = "getUsuarioById",
            summary = "Obtiene usuario existente",
            parameters = {@Parameter(name="id", description = "Id del usuario", example = "1", required = true)}
    )
    public ResponseEntity<UsuarioDTO> getUsuariobyID(@PathVariable(name = "id", required = true) Long idUsuario){
        UsuarioDTO usuario = usuarioService.getUsuarioById(idUsuario);
        return ResponseEntity.ok().body(usuario);
    }

    @PostMapping
    @Operation(
            operationId = "createUsuario",
            summary = "Persiste un nuevo usuario",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos para el nuevo usuario")
    )
    public ResponseEntity<UsuarioDTO> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO createdUsuario = usuarioService.createUsuario(usuarioDTO);
        return ResponseEntity.ok().body(createdUsuario);
    }

}