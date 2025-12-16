package mascotas.project.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            InputStream serviceAccount = getServiceAccountStream();
            
            try {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                return FirebaseApp.initializeApp(options);
            } finally {
                if (serviceAccount != null) {
                    serviceAccount.close();
                }
            }
        }
        return FirebaseApp.getInstance();
    }

    /**
     * Obtiene el InputStream de las credenciales de Firebase.
     * Primero intenta desde la variable de entorno FIREBASE_SERVICE_ACCOUNT,
     * si no existe, usa el archivo firebase-service-account.json del classpath.
     */
    private InputStream getServiceAccountStream() throws IOException {
        String firebaseCredentials = System.getenv("firebase.config.json");
        
        if (firebaseCredentials != null && !firebaseCredentials.isEmpty()) {
            System.out.println("✅ Usando credenciales de Firebase desde variable de entorno FIREBASE_SERVICE_ACCOUNT");
            return new ByteArrayInputStream(firebaseCredentials.getBytes(StandardCharsets.UTF_8));
        } else {
            System.out.println("ℹ️ Usando credenciales de Firebase desde archivo firebase-service-account.json");
            return new ClassPathResource("firebase-service-account.json").getInputStream();
        }
    }
}
