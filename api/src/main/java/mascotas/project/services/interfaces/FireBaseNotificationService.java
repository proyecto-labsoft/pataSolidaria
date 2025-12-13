package mascotas.project.services.interfaces;

import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.TopicManagementResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface FireBaseNotificationService {
    String sendNotification(String token, String title, String body, Map<String, String> data);
    BatchResponse sendMulticastNotification( List<String> tokens, String title, String body, Map<String, String> data);
    String sendToTopic(String topic, String title, String body, Map<String, String> data);
    TopicManagementResponse subscribeToTopic(List<String> tokens, String topic);
    TopicManagementResponse unsubscribeFromTopic(List<String> tokens, String topic);

}
