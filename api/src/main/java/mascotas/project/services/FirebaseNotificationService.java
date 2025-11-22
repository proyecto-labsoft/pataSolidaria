package mascotas.project.services;

import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FirebaseNotificationService {

    /**
     * Envía una notificación push a un dispositivo específico
     */
    public String sendNotification(String token, String title, String body, Map<String, String> data) {
        try {
            Message.Builder messageBuilder = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            // Configuración específica para Android
            messageBuilder.setAndroidConfig(AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(AndroidNotification.builder()
                            .setSound("default")
                            .setColor("#FF6F00")
                            .build())
                    .build());

            // Configuración específica para iOS
            messageBuilder.setApnsConfig(ApnsConfig.builder()
                    .setAps(Aps.builder()
                            .setSound("default")
                            .build())
                    .build());

            String response = FirebaseMessaging.getInstance().send(messageBuilder.build());
            System.out.println("Notificación enviada exitosamente: " + response);
            return response;
        } catch (Exception e) {
            System.err.println("Error al enviar notificación: " + e.getMessage());
            return null;
        }
    }

    /**
     * Envía notificaciones a múltiples dispositivos
     */
    public BatchResponse sendMulticastNotification(
            List<String> tokens, 
            String title, 
            String body, 
            Map<String, String> data) {
        try {
            MulticastMessage.Builder messageBuilder = MulticastMessage.builder()
                    .addAllTokens(tokens)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            messageBuilder.setAndroidConfig(AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .build());

            BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(messageBuilder.build());
            System.out.println("Notificaciones enviadas. Exitosas: " + response.getSuccessCount() + 
                             ", Fallidas: " + response.getFailureCount());
            return response;
        } catch (Exception e) {
            System.err.println("Error al enviar notificaciones múltiples: " + e.getMessage());
            return null;
        }
    }

    /**
     * Envía una notificación a un topic específico
     */
    public String sendToTopic(String topic, String title, String body, Map<String, String> data) {
        try {
            Message.Builder messageBuilder = Message.builder()
                    .setTopic(topic)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            String response = FirebaseMessaging.getInstance().send(messageBuilder.build());
            System.out.println("Notificación enviada al topic exitosamente: " + response);
            return response;
        } catch (Exception e) {
            System.err.println("Error al enviar notificación al topic: " + e.getMessage());
            return null;
        }
    }

    /**
     * Suscribe dispositivos a un topic
     */
    public TopicManagementResponse subscribeToTopic(List<String> tokens, String topic) {
        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance()
                    .subscribeToTopic(tokens, topic);
            System.out.println("Dispositivos suscritos al topic: " + response.getSuccessCount());
            return response;
        } catch (Exception e) {
            System.err.println("Error al suscribir al topic: " + e.getMessage());
            return null;
        }
    }

    /**
     * Desuscribe dispositivos de un topic
     */
    public TopicManagementResponse unsubscribeFromTopic(List<String> tokens, String topic) {
        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance()
                    .unsubscribeFromTopic(tokens, topic);
            System.out.println("Dispositivos desuscritos del topic: " + response.getSuccessCount());
            return response;
        } catch (Exception e) {
            System.err.println("Error al desuscribir del topic: " + e.getMessage());
            return null;
        }
    }
}
