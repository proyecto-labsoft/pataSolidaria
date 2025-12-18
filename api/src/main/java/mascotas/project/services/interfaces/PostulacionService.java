package mascotas.project.services.interfaces;

import mascotas.project.dto.PostulacionDetailDTO;
import mascotas.project.dto.PostulacionRequestDTO;
import mascotas.project.entities.Postulacion;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PostulacionService {

    Postulacion savePostulacion(PostulacionRequestDTO postulacion);

    List<PostulacionDetailDTO> getAllPostulacionesByUsuario(Long  usuarioId);

    List<PostulacionDetailDTO> getAllPostulacionesByAdopcion(Long  adopcionId);
}
