package mascotas.project.services.interfaces;

import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Usuario;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UsuarioService {

    UsuarioDTO getUsuarioById(Long idUsuario);

    UsuarioDTO createUsuario(UsuarioDTO usuarioDTO);

    Usuario findById(Long idUsuario);

    Usuario findByFirebaseUid(String firebaseUid);

    Usuario findByEmail(String email);

    Usuario save(Usuario usuario);

    boolean existsByFirebaseUid(String firebaseUid);

    void updatePushToken(String firebaseUid, String pushToken);

    void createOrUpdatePushToken(String firebaseUid, String pushToken);

    Usuario syncUsuarioFromFirebase(String firebaseUid, String email, String displayName);

    void updatePerfil(String firebaseUid, String nombre, String celular, String direccion);

    void removePushToken(String firebaseUid);

    boolean isAdmin(String firebaseUid);

    void setAdminRole(String firebaseUid, boolean isAdmin);

    List<Usuario> findAllWithNotificationsEnabled();
}