package mascotas.project.services.interfaces;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public interface FireBaseAuthService {

    String verifyToken(String idToken);
    FirebaseToken getTokenInfo(String idToken);
}
