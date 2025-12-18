package mascotas.project.repositories;

import mascotas.project.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByFirebaseUid(String firebaseUid);
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByFirebaseUid(String firebaseUid);
    
    /**
     * Obtiene todos los usuarios que tienen notificaciones habilitadas y pushToken registrado
     */
    @Query("SELECT u FROM Usuario u WHERE u.notificacionesHabilitadas = true AND u.pushToken IS NOT NULL")
    List<Usuario> findAllWithNotificationsEnabled();

    /**
     * Obtiene todos los administradores que tienen notificaciones habilitadas y pushToken registrado
     */
    @Query("SELECT u FROM Usuario u WHERE u.administrador = true AND u.notificacionesHabilitadas = true AND u.pushToken IS NOT NULL")
    List<Usuario> findAllAdminsWithNotificationsEnabled();
}
