package mascotas.project.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.PostulacionRequestDTO;
import mascotas.project.entities.Postulacion;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.PostulacionMapper;
import mascotas.project.repositories.PostulacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class PostulacionService {

    private final PostulacionRepository postulacionRepository;
    private final PostulacionMapper postulacionMapper;
    private final UsuarioService usuarioService;
    private final AdopcionService adopcionService;


    public Postulacion savePostulacion(PostulacionRequestDTO postulacion){

        return Optional.of(postulacion)
                     .map(
                            p -> {

                                usuarioService.getUsuarioById(p.getUsuarioId());
                                adopcionService.getAdopcionById(p.getAdopcionId());

                                return postulacionMapper.toPostulacionEntity(postulacion);
                     })
                     .map(
                            postulacionEntity -> {
                                Postulacion postulacionPersistida =  postulacionRepository.save(postulacionEntity);

                                log.info("POSTULACION_SERVICE - postulacion persistida ID: {} ", postulacionPersistida.getId() );
                                return postulacionPersistida;
                            }
                     ).orElseThrow( RuntimeException::new );
    }


    public List<PostulacionRequestDTO> getAllPostulacionesByUsuario(Long  usuarioId){

       return Optional.of(usuarioId)
                .map(usuario ->{

                    usuarioService.getUsuarioById(usuario);

                   return postulacionRepository.findPostulacionesByUsuarioId(usuarioId)
                            .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()) );

                })
                .map(postulacionMapper::toPostulacionDTOList)
               .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()));
    }

    public List<PostulacionRequestDTO> getAllPostulacionesByAdopcion(Long  adopcionId){

        return Optional.of(adopcionId)
                .map(adopcion ->{

                    adopcionService.getAdopcionById(adopcion);

                    return postulacionRepository.findPostulacionesByAdopcionIdOrderByFechaDesc(adopcion)
                            .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()) );

                })
                .map(postulacionMapper::toPostulacionDTOList)
                .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()));
    }
}