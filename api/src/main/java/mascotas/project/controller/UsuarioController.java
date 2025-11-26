package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Usuario;
import mascotas.project.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.core.Authentication;
import java.util.Map;

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

    @PostMapping("/sync")
    @Operation(
            operationId = "syncUsuarioFromFirebase",
            summary = "Sincroniza usuario desde Firebase Authentication",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Datos del usuario de Firebase (email, displayName)",
                required = true
            )
    )
    public ResponseEntity<?> syncUsuarioFromFirebase(
            @RequestBody Map<String, String> payload,
            Authentication authentication
    ) {
        try {
            String firebaseUid = authentication.getName();
            String email = payload.get("email");
            String displayName = payload.get("displayName");
            
            log.info("🔄 Sincronizando usuario desde Firebase: {} ({})", email, firebaseUid);
            
            usuarioService.syncUsuarioFromFirebase(firebaseUid, email, displayName);
            
            return ResponseEntity.ok(Map.of(
                "message", "Usuario sincronizado exitosamente",
                "firebaseUid", firebaseUid,
                "email", email
            ));
        } catch (Exception e) {
            log.error("❌ Error al sincronizar usuario: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

        @PostMapping("/perfil")
    @Operation(
            operationId = "updatePerfil",
            summary = "Actualiza el perfil del usuario autenticado",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Datos del perfil a actualizar (nombre, celular, direccion)",
                required = true
            )
    )
    public ResponseEntity<?> updatePerfil(
            @RequestBody Map<String, String> payload,
            Authentication authentication
    ) {
        try {
            String firebaseUid = authentication.getName();
            String nombre = payload.get("nombre");
            String celular = payload.get("celular");
            String direccion = payload.get("direccion");
            
            log.info("📝 Actualizando perfil de usuario: {}", firebaseUid);
            
            usuarioService.updatePerfil(firebaseUid, nombre, celular, direccion);
            
            return ResponseEntity.ok(Map.of(
                "message", "Perfil actualizado exitosamente",
                "firebaseUid", firebaseUid
            ));
        } catch (Exception e) {
            log.error("❌ Error al actualizar perfil: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/perfil")
    @Operation(
            operationId = "getPerfil",
            summary = "Obtiene el perfil del usuario autenticado"
    )
    public ResponseEntity<?> getPerfil(Authentication authentication) {
        try {
            String firebaseUid = authentication.getName();
            log.info("📖 Obteniendo perfil de usuario: {}", firebaseUid);
            
            Usuario usuario = usuarioService.findByFirebaseUid(firebaseUid);
            
            if (usuario == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(Map.of(
                "firebaseUid", usuario.getFirebaseUid() != null ? usuario.getFirebaseUid() : "",
                "nombre", usuario.getNombre() != null ? usuario.getNombre() : "",
                "email", usuario.getEmail() != null ? usuario.getEmail() : "",
                "celular", usuario.getCelular() != null ? usuario.getCelular().toString() : "",
                "direccion", usuario.getDireccion() != null ? usuario.getDireccion() : "",
                "notificacionesHabilitadas", usuario.getNotificacionesHabilitadas() != null ? usuario.getNotificacionesHabilitadas() : false
            ));
        } catch (Exception e) {
            log.error("❌ Error al obtener perfil: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/push-token")
    @Operation(
            operationId = "savePushToken",
            summary = "Guarda el token de notificaciones push del usuario autenticado",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Token de push notification del dispositivo",
                required = true
            )
    )
    public ResponseEntity<?> savePushToken(
            @RequestBody Map<String, String> payload,
            Authentication authentication
    ) {
        try {
            String pushToken = payload.get("pushToken");
            String firebaseUid = authentication.getName(); // El firebaseUid viene del JWT
            
            if (pushToken == null || pushToken.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Push token es requerido"));
            }
            
            log.info("📱 Guardando push token para usuario: {}", firebaseUid);
            
            // Crear usuario si no existe, o actualizar su push token
            usuarioService.createOrUpdatePushToken(firebaseUid, pushToken);
            
            return ResponseEntity.ok(Map.of(
                "message", "Push token guardado exitosamente",
                "firebaseUid", firebaseUid
            ));
        } catch (Exception e) {
            log.error("❌ Error al guardar push token: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/push-token")
    @Operation(
            operationId = "removePushToken",
            summary = "Elimina el token de notificaciones push del usuario autenticado (al cerrar sesión)"
    )
    public ResponseEntity<?> removePushToken(Authentication authentication) {
        try {
            String firebaseUid = authentication.getName();
            
            log.info("🔔 Eliminando push token para usuario: {}", firebaseUid);
            usuarioService.removePushToken(firebaseUid);
            
            return ResponseEntity.ok(Map.of(
                "message", "Push token eliminado exitosamente",
                "firebaseUid", firebaseUid
            ));
        } catch (Exception e) {
            log.error("❌ Error al eliminar push token: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/set-admin")
    @Operation(
            operationId = "setAdmin",
            summary = "Establece o quita el rol de administrador a un usuario (solo para admins)",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Firebase UID del usuario y si debe ser admin",
                required = true
            )
    )
    public ResponseEntity<?> setAdmin(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        try {
            // Spring Security ya verificó que el usuario tiene ROLE_ADMIN
            // Si llegó aquí, es porque es admin ✅
            
            String currentUserUid = authentication.getName();
            String targetUserUid = (String) payload.get("firebaseUid");
            Boolean isAdmin = (Boolean) payload.get("isAdmin");
            
            if (targetUserUid == null || isAdmin == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "firebaseUid y isAdmin son requeridos"));
            }
            
            log.info("👑 Admin {} cambiando rol de {} a isAdmin={}", 
                currentUserUid, targetUserUid, isAdmin);
            
            usuarioService.setAdminRole(targetUserUid, isAdmin);
            
            return ResponseEntity.ok(Map.of(
                "message", "Rol actualizado exitosamente",
                "firebaseUid", targetUserUid,
                "isAdmin", isAdmin
            ));
        } catch (Exception e) {
            log.error("❌ Error al cambiar rol: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

}
