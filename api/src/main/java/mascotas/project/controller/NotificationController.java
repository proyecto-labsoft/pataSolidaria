package mascotas.project.controller;

import lombok.AllArgsConstructor;
import mascotas.project.entities.Usuario;
import mascotas.project.services.interfaces.FireBaseAuthService;
import mascotas.project.services.interfaces.FireBaseNotificationService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final FireBaseNotificationService fireBaseNotificationService;
    private final FireBaseAuthService fireBaseAuthService;
    private final UsuarioService usuarioService;

    /**
     * Registra o actualiza el push token del usuario
     */
    @PostMapping("/register-token")
    public ResponseEntity<?> registerPushToken(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String pushToken = request.get("pushToken");
            String firebaseUid = (String) authentication.getPrincipal();

            // Buscar usuario por Firebase UID y actualizar su push token
            Usuario usuario = usuarioService.findByFirebaseUid(firebaseUid);
            if (usuario != null) {
                usuario.setPushToken(pushToken);
                usuarioService.save(usuario);
                return ResponseEntity.ok(Map.of("message", "Token registrado exitosamente"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Envía una notificación de prueba
     */
    @PostMapping("/test")
    public ResponseEntity<?> sendTestNotification(Authentication authentication) {
        try {
            String firebaseUid = (String) authentication.getPrincipal();
            Usuario usuario = usuarioService.findByFirebaseUid(firebaseUid);

            if (usuario != null && usuario.getPushToken() != null) {
                String response = fireBaseNotificationService.sendNotification(
                        usuario.getPushToken(),
                        "Notificación de prueba",
                        "Esta es una notificación de prueba de Pata Solidaria",
                        Map.of("type", "test")
                );

                if (response != null) {
                    return ResponseEntity.ok(Map.of(
                            "message", "Notificación enviada",
                            "response", response
                    ));
                } else {
                    return ResponseEntity.badRequest().body(Map.of("error", "Error al enviar notificación"));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Token no registrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Habilita/deshabilita notificaciones para el usuario
     */
    @PutMapping("/toggle")
    public ResponseEntity<?> toggleNotifications(
            @RequestBody Map<String, Boolean> request,
            Authentication authentication) {
        try {
            String firebaseUid = (String) authentication.getPrincipal();
            Boolean enabled = request.get("enabled");

            Usuario usuario = usuarioService.findByFirebaseUid(firebaseUid);
            if (usuario != null) {
                usuario.setNotificacionesHabilitadas(enabled);
                usuarioService.save(usuario);
                return ResponseEntity.ok(Map.of(
                        "message", "Preferencias actualizadas",
                        "enabled", enabled
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
