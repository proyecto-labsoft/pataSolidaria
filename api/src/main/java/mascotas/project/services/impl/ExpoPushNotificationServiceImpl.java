package mascotas.project.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import mascotas.project.services.interfaces.ExpoPushNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class ExpoPushNotificationServiceImpl implements ExpoPushNotificationService {

    private static final Logger log = LoggerFactory.getLogger(ExpoPushNotificationServiceImpl.class);
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ExpoPushNotificationServiceImpl() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public boolean sendNotification(String token, String title, String body, Map<String, String> data) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("to", token);
            message.put("title", title);
            message.put("body", body);
            message.put("sound", "default");
            message.put("priority", "high");
            
            if (data != null && !data.isEmpty()) {
                message.put("data", data);
            }

            String jsonPayload = objectMapper.writeValueAsString(message);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EXPO_PUSH_URL))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                log.info("✅ Notificación Expo enviada exitosamente a token: {}", token.substring(0, 20) + "...");
                return true;
            } else {
                log.error("❌ Error al enviar notificación Expo. Status: {}, Response: {}", 
                         response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.error("❌ Excepción al enviar notificación Expo: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public Map<String, Object> sendMulticastNotification(List<String> tokens, String title, String body, Map<String, String> data) {
        try {
            // Expo acepta hasta 100 notificaciones por request
            List<Map<String, Object>> messages = new ArrayList<>();
            
            for (String token : tokens) {
                Map<String, Object> message = new HashMap<>();
                message.put("to", token);
                message.put("title", title);
                message.put("body", body);
                message.put("sound", "default");
                message.put("priority", "high");
                
                if (data != null && !data.isEmpty()) {
                    message.put("data", data);
                }
                
                messages.add(message);
            }

            String jsonPayload = objectMapper.writeValueAsString(messages);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EXPO_PUSH_URL))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            Map<String, Object> result = new HashMap<>();
            
            if (response.statusCode() == 200) {
                // Parsear la respuesta para obtener estadísticas
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
                
                int successCount = 0;
                int failureCount = 0;
                
                if (dataList != null) {
                    for (Map<String, Object> item : dataList) {
                        String status = (String) item.get("status");
                        if ("ok".equals(status)) {
                            successCount++;
                        } else {
                            failureCount++;
                            log.warn("⚠️ Notificación falló: {}", item.get("message"));
                        }
                    }
                }
                
                result.put("successCount", successCount);
                result.put("failureCount", failureCount);
                result.put("totalSent", tokens.size());
                
                log.info("📢 Notificaciones Expo enviadas. Exitosas: {}, Fallidas: {}", successCount, failureCount);
            } else {
                log.error("❌ Error al enviar notificaciones Expo multicast. Status: {}, Response: {}", 
                         response.statusCode(), response.body());
                result.put("successCount", 0);
                result.put("failureCount", tokens.size());
                result.put("totalSent", tokens.size());
            }
            
            return result;
        } catch (Exception e) {
            log.error("❌ Excepción al enviar notificaciones Expo multicast: {}", e.getMessage(), e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("successCount", 0);
            errorResult.put("failureCount", tokens.size());
            errorResult.put("totalSent", tokens.size());
            return errorResult;
        }
    }
}
