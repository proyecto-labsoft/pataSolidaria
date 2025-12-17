package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.entities.Usuario;
import mascotas.project.services.interfaces.ExpoPushNotificationService;
import mascotas.project.services.interfaces.FireBaseNotificationService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/notifications")
@AllArgsConstructor
@Tag(name = "Notificaciones", description = "Endpoints para gestión de notificaciones push")
public class NotificationController {

    private final FireBaseNotificationService fireBaseNotificationService;
    private final ExpoPushNotificationService expoPushNotificationService;
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

            if (usuario != null && 
                usuario.getPushToken() != null && 
                !usuario.getPushToken().trim().isEmpty() && 
                !"null".equalsIgnoreCase(usuario.getPushToken().trim())) {
                boolean success = expoPushNotificationService.sendNotification(
                        usuario.getPushToken(),
                        "Notificación de prueba",
                        "Esta es una notificación de prueba de Pata Solidaria",
                        Map.of("type", "test")
                );

                if (success) {
                    return ResponseEntity.ok(Map.of(
                            "message", "Notificación enviada exitosamente"
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

    // ============================================
    // ENDPOINTS DE ADMINISTRACIÓN
    // ============================================

    /**
     * Envía una notificación broadcast a todos los usuarios con notificaciones habilitadas
     * TODO: Agregar verificación de rol administrador
     */
    @PostMapping("/admin/broadcast")
    @Operation(
            operationId = "sendBroadcastNotification",
            summary = "Envía una notificación a todos los usuarios (Solo administradores)",
            description = "Envía una notificación push a todos los usuarios que tienen notificaciones habilitadas. Requiere rol de administrador."
    )
    public ResponseEntity<?> sendBroadcastNotification(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            // TODO: Descomentar cuando se implemente verificación de roles
            // String firebaseUid = (String) authentication.getPrincipal();
            // Usuario admin = usuarioService.findByFirebaseUid(firebaseUid);
            // if (admin == null || !admin.getAdministrador()) {
            //     return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos de administrador"));
            // }

            String title = request.get("title");
            String body = request.get("body");
            String type = request.getOrDefault("type", "admin_broadcast");

            if (title == null || title.isEmpty() || body == null || body.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title y body son requeridos"));
            }

            // Obtener todos los usuarios con notificaciones habilitadas
            List<Usuario> usuarios = usuarioService.findAllWithNotificationsEnabled();
            List<String> tokens = usuarios.stream()
                    .map(Usuario::getPushToken)
                    .filter(token -> token != null && 
                            !token.trim().isEmpty() && 
                            !"null".equalsIgnoreCase(token.trim()))
                    .collect(Collectors.toList());

            if (tokens.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "message", "No hay usuarios con notificaciones habilitadas",
                        "sent", 0
                ));
            }

            // Preparar datos adicionales
            Map<String, String> data = new HashMap<>();
            data.put("type", type);
            if (request.containsKey("data")) {
                data.put("customData", request.get("data"));
            }

            // Enviar notificación multicast usando Expo Push
            var response = expoPushNotificationService.sendMulticastNotification(tokens, title, body, data);

            if (response != null) {
                int successCount = (int) response.getOrDefault("successCount", 0);
                int failureCount = (int) response.getOrDefault("failureCount", 0);
                
                log.info("📢 Notificación broadcast Expo enviada a {} usuarios. Exitosas: {}, Fallidas: {}",
                        tokens.size(), successCount, failureCount);

                return ResponseEntity.ok(Map.of(
                        "message", "Notificación broadcast enviada",
                        "totalUsers", usuarios.size(),
                        "tokensSent", tokens.size(),
                        "successCount", successCount,
                        "failureCount", failureCount
                ));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "error", "Error al enviar notificaciones"
                ));
            }
        } catch (Exception e) {
            log.error("❌ Error al enviar notificación broadcast: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Envía una notificación a un topic específico
     * TODO: Agregar verificación de rol administrador
     */
    @PostMapping("/admin/topic")
    @Operation(
            operationId = "sendTopicNotification",
            summary = "Envía una notificación a un topic específico (Solo administradores)",
            description = "Envía una notificación push a todos los usuarios suscritos a un topic. Requiere rol de administrador."
    )
    public ResponseEntity<?> sendTopicNotification(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            // TODO: Descomentar cuando se implemente verificación de roles
            // String firebaseUid = (String) authentication.getPrincipal();
            // Usuario admin = usuarioService.findByFirebaseUid(firebaseUid);
            // if (admin == null || !admin.getAdministrador()) {
            //     return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos de administrador"));
            // }

            String topic = request.get("topic");
            String title = request.get("title");
            String body = request.get("body");
            String type = request.getOrDefault("type", "topic_notification");

            if (topic == null || topic.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Topic es requerido"));
            }
            if (title == null || title.isEmpty() || body == null || body.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title y body son requeridos"));
            }

            // Preparar datos adicionales
            Map<String, String> data = new HashMap<>();
            data.put("type", type);
            data.put("topic", topic);
            if (request.containsKey("data")) {
                data.put("customData", request.get("data"));
            }

            // Enviar notificación al topic
            String response = fireBaseNotificationService.sendToTopic(topic, title, body, data);

            if (response != null) {
                log.info("📢 Notificación enviada al topic '{}'", topic);
                return ResponseEntity.ok(Map.of(
                        "message", "Notificación enviada al topic exitosamente",
                        "topic", topic,
                        "response", response
                ));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "error", "Error al enviar notificación al topic"
                ));
            }
        } catch (Exception e) {
            log.error("❌ Error al enviar notificación al topic: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Envía una notificación a un usuario específico
     * TODO: Agregar verificación de rol administrador
     */
    @PostMapping("/admin/send-to-user")
    @Operation(
            operationId = "sendNotificationToUser",
            summary = "Envía una notificación a un usuario específico (Solo administradores)",
            description = "Envía una notificación push a un usuario específico por su ID. Requiere rol de administrador."
    )
    public ResponseEntity<?> sendNotificationToUser(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            // TODO: Descomentar cuando se implemente verificación de roles
            // String firebaseUid = (String) authentication.getPrincipal();
            // Usuario admin = usuarioService.findByFirebaseUid(firebaseUid);
            // if (admin == null || !admin.getAdministrador()) {
            //     return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos de administrador"));
            // }

            String userIdStr = request.get("userId");
            String title = request.get("title");
            String body = request.get("body");
            String type = request.getOrDefault("type", "admin_message");

            if (userIdStr == null || userIdStr.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId es requerido"));
            }
            if (title == null || title.isEmpty() || body == null || body.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title y body son requeridos"));
            }

            Long userId = Long.parseLong(userIdStr);
            // Obtener Usuario directamente por ID (UsuarioDTO no tiene firebaseUid)
            var usuario = usuarioService.findById(userId);

            if (usuario == null || 
                usuario.getPushToken() == null || 
                usuario.getPushToken().trim().isEmpty() || 
                "null".equalsIgnoreCase(usuario.getPushToken().trim())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Usuario no tiene token de notificaciones válido"
                ));
            }

            if (!usuario.getNotificacionesHabilitadas()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Usuario tiene notificaciones deshabilitadas"
                ));
            }

            // Preparar datos adicionales
            Map<String, String> data = new HashMap<>();
            data.put("type", type);
            data.put("userId", userId.toString());
            if (request.containsKey("data")) {
                data.put("customData", request.get("data"));
            }

            // Enviar notificación usando Expo Push
            boolean success = expoPushNotificationService.sendNotification(
                    usuario.getPushToken(),
                    title,
                    body,
                    data
            );

            if (success) {
                log.info("📧 Notificación Expo enviada al usuario {} ({})", usuario.getEmail(), userId);
                return ResponseEntity.ok(Map.of(
                        "message", "Notificación enviada exitosamente",
                        "userId", userId,
                        "userEmail", usuario.getEmail()
                ));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "error", "Error al enviar notificación"
                ));
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId debe ser un número válido"));
        } catch (Exception e) {
            log.error("❌ Error al enviar notificación al usuario: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Obtiene estadísticas de notificaciones
     * TODO: Agregar verificación de rol administrador
     */
    @GetMapping("/admin/stats")
    @Operation(
            operationId = "getNotificationStats",
            summary = "Obtiene estadísticas de notificaciones (Solo administradores)",
            description = "Obtiene información sobre cuántos usuarios tienen notificaciones habilitadas. Requiere rol de administrador."
    )
    public ResponseEntity<?> getNotificationStats(Authentication authentication) {
        try {
            // TODO: Descomentar cuando se implemente verificación de roles
            // String firebaseUid = (String) authentication.getPrincipal();
            // Usuario admin = usuarioService.findByFirebaseUid(firebaseUid);
            // if (admin == null || !admin.getAdministrador()) {
            //     return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos de administrador"));
            // }

            List<Usuario> allUsers = usuarioService.findAllWithNotificationsEnabled();
            long usersWithTokens = allUsers.stream()
                    .filter(u -> u.getPushToken() != null && !u.getPushToken().isEmpty())
                    .count();

            return ResponseEntity.ok(Map.of(
                    "totalUsersWithNotificationsEnabled", allUsers.size(),
                    "usersWithValidTokens", usersWithTokens,
                    "usersWithoutTokens", allUsers.size() - usersWithTokens
            ));
        } catch (Exception e) {
            log.error("❌ Error al obtener estadísticas: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
