package mascotas.project.services.interfaces;

import java.util.List;
import java.util.Map;

public interface ExpoPushNotificationService {
    
    /**
     * Envía una notificación a un solo dispositivo
     */
    boolean sendNotification(String token, String title, String body, Map<String, String> data);
    
    /**
     * Envía notificaciones a múltiples dispositivos
     */
    Map<String, Object> sendMulticastNotification(List<String> tokens, String title, String body, Map<String, String> data);
}
