package mascotas.project.services.interfaces;

import mascotas.project.dto.PostulacionRequestDTO;
import mascotas.project.entities.Postulacion;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PostulacionService {

    Postulacion savePostulacion(PostulacionRequestDTO postulacion);

    List<PostulacionRequestDTO> getAllPostulacionesByUsuario(Long  usuarioId);

    List<PostulacionRequestDTO> getAllPostulacionesByAdopcion(Long  adopcionId);
}
