package mascotas.project.services;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.UsuarioDTO;
import mascotas.project.entities.Usuario;
import mascotas.project.exceptions.NotFoundException;
import mascotas.project.mapper.UsuarioMapper;
import mascotas.project.repositories.UsuarioRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class UsuarioService {

    UsuarioRepository usuarioRepository;
    UsuarioMapper usuarioMapper;

    @Transactional
    public UsuarioDTO getUsuarioById(Long idUsuario){

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new NotFoundException(ErrorsEnums.USUARIO_NOT_FOUND_ERROR.getDescription() + idUsuario ));

        return  usuarioMapper.toUsuarioDto(usuario);
    }

    @Transactional
    public UsuarioDTO createUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);
        Usuario savedUsuario = usuarioRepository.save(usuario);
        return usuarioMapper.toUsuarioDto(savedUsuario);
    }

    /**
     * Busca un usuario por su Firebase UID
     */
    @Transactional
    public Usuario findByFirebaseUid(String firebaseUid) {
        return usuarioRepository.findByFirebaseUid(firebaseUid).orElse(null);
    }

    /**
     * Busca un usuario por su email
     */
    @Transactional
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    /**
     * Guarda o actualiza un usuario
     */
    @Transactional
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    /**
     * Verifica si existe un usuario con el Firebase UID dado
     */
    @Transactional
    public boolean existsByFirebaseUid(String firebaseUid) {
        return usuarioRepository.existsByFirebaseUid(firebaseUid);
    }

    /**
     * Actualiza el token de notificaciones push del usuario
     */
    @Transactional
    public void updatePushToken(String firebaseUid, String pushToken) {
        Usuario usuario = usuarioRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con firebaseUid: " + firebaseUid));
        
        log.info("📱 Actualizando push token para usuario: {} ({})", usuario.getEmail(), firebaseUid);
        usuario.setPushToken(pushToken);
        usuario.setNotificacionesHabilitadas(true); // Habilitar notificaciones al guardar el token
        usuarioRepository.save(usuario);
        log.info("✅ Push token actualizado exitosamente");
    }

    /**
     * Crea o actualiza el token de notificaciones push del usuario
     * Si el usuario no existe, lo crea con datos básicos
     */
    @Transactional
    public void createOrUpdatePushToken(String firebaseUid, String pushToken) {
        Usuario usuario = usuarioRepository.findByFirebaseUid(firebaseUid).orElse(null);
        
        if (usuario == null) {
            // Usuario no existe, crear uno nuevo
            log.info("🆕 Creando nuevo usuario con firebaseUid: {}", firebaseUid);
            usuario = new Usuario();
            usuario.setFirebaseUid(firebaseUid);
            usuario.setNombre("Usuario " + firebaseUid.substring(0, 8)); // Nombre temporal
            usuario.setEmail("user_" + firebaseUid.substring(0, 8) + "@firebase.com"); // Email temporal
            usuario.setAdministrador(false);
        } else {
            log.info("📱 Actualizando push token para usuario existente: {} ({})", usuario.getEmail(), firebaseUid);
        }
        
        usuario.setPushToken(pushToken);
        usuario.setNotificacionesHabilitadas(true);
        usuarioRepository.save(usuario);
        log.info("✅ Push token guardado exitosamente para: {}", firebaseUid);
    }

    /**
     * Sincroniza un usuario desde Firebase Authentication
     * Crea el usuario si no existe o actualiza sus datos si ya existe
     * También busca por email para evitar duplicados
     * 
     * IMPORTANTE: Solo actualiza el nombre al crear el usuario por primera vez.
     * El nombre del perfil en el backend es la fuente de verdad y no se sobrescribe.
     */
    @Transactional
    public Usuario syncUsuarioFromFirebase(String firebaseUid, String email, String displayName) {
        // Primero buscar por Firebase UID
        Usuario usuario = usuarioRepository.findByFirebaseUid(firebaseUid).orElse(null);
        
        if (usuario == null && email != null) {
            // Si no se encuentra por UID, buscar por email
            usuario = usuarioRepository.findByEmail(email).orElse(null);
            
            if (usuario != null) {
                // Usuario existe pero no tiene firebaseUid, actualizarlo
                log.info("🔗 Vinculando usuario existente con Firebase: {} ({})", email, firebaseUid);
                usuario.setFirebaseUid(firebaseUid);
            }
        }
        
        if (usuario == null) {
            // Usuario no existe, crear uno nuevo con datos de Firebase
            log.info("🆕 Creando nuevo usuario desde Firebase: {} ({})", email, firebaseUid);
            usuario = new Usuario();
            usuario.setFirebaseUid(firebaseUid);
            usuario.setEmail(email);
            usuario.setNombre(displayName != null ? displayName : "Usuario");
            usuario.setAdministrador(false);
            usuario.setNotificacionesHabilitadas(true);
        } else {
            // Usuario ya existe, solo actualizar email si cambió en Firebase
            // NO actualizar el nombre - el perfil del backend es la fuente de verdad
            log.info("🔄 Sincronizando usuario existente: {} ({})", email, firebaseUid);
            if (email != null && !email.equals(usuario.getEmail())) {
                log.info("📧 Actualizando email: {} -> {}", usuario.getEmail(), email);
                usuario.setEmail(email);
            }
            // El nombre NO se actualiza - se mantiene el del perfil del usuario
        }
        
        usuarioRepository.save(usuario);
        log.info("✅ Usuario sincronizado exitosamente: {}", email);
        return usuario;
    }

    /**
     * Actualiza el perfil del usuario (nombre, celular, dirección)
     */
    @Transactional
    public void updatePerfil(String firebaseUid, String nombre, String celular, String direccion) {
        Usuario usuario = usuarioRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con firebaseUid: " + firebaseUid));
        
        log.info("📝 Actualizando perfil de: {} ({})", usuario.getEmail(), firebaseUid);
        
        if (nombre != null && !nombre.isEmpty()) {
            usuario.setNombre(nombre);
        }
        
        if (celular != null && !celular.isEmpty()) {
            try {
                usuario.setCelular(Integer.parseInt(celular));
            } catch (NumberFormatException e) {
                log.warn("⚠️ Celular inválido, no se actualizará: {}", celular);
            }
        }
        
        if (direccion != null && !direccion.isEmpty()) {
            usuario.setDireccion(direccion);
        }
        
        usuarioRepository.save(usuario);
        log.info("✅ Perfil actualizado exitosamente");
    }

    /**
     * Elimina el token de notificaciones push del usuario (al cerrar sesión)
     */
    @Transactional
    public void removePushToken(String firebaseUid) {
        Usuario usuario = usuarioRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con firebaseUid: " + firebaseUid));
        
        log.info("🔔 Eliminando push token para usuario: {} ({})", usuario.getEmail(), firebaseUid);
        usuario.setPushToken(null);
        usuario.setNotificacionesHabilitadas(false); // Deshabilitar notificaciones al eliminar el token
        usuarioRepository.save(usuario);
        log.info("✅ Push token eliminado exitosamente");
    }

}
