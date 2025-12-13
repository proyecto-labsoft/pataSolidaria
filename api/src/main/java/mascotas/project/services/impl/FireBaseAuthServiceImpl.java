package mascotas.project.services.impl;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import mascotas.project.services.interfaces.FireBaseAuthService;
import org.springframework.stereotype.Service;

@Service
public class FireBaseAuthServiceImpl implements FireBaseAuthService {

    /**
     * Verifica el token JWT de Firebase y retorna el UID del usuario
     * @param idToken Token JWT de Firebase
     * @return UID del usuario de Firebase o null si el token es inválido
     */
    @Override
    public String verifyToken(String idToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            return decodedToken.getUid();
        } catch (Exception e) {
            System.err.println("Error al verificar token: " + e.getMessage());
            return null;
        }
    }

    /**
     * Obtiene información adicional del token
     */
    @Override
    public FirebaseToken getTokenInfo(String idToken) {
        try {
            return FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (Exception e) {
            System.err.println("Error al obtener información del token: " + e.getMessage());
            return null;
        }
    }
}
