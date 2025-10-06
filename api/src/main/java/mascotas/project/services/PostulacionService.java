package mascotas.project.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.PostulacionDTO;
import mascotas.project.entities.Postulacion;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.exceptions.NotFoundException;
import mascotas.project.mapper.PostulacionMapper;
import mascotas.project.repositories.AdopocionRepository;
import mascotas.project.repositories.PostulacionRepository;
import mascotas.project.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class PostulacionService {

    private PostulacionRepository postulacionRepository;
    private UsuarioRepository usuarioRepository;
    private AdopocionRepository adopcionRepository;
    private PostulacionMapper postulacionMapper;


    public Postulacion savePostulacion(PostulacionDTO postulacion){

        return Optional.of(postulacion)
                     .map(
                            p -> {
                                usuarioRepository.findById(p.getUsuario())
                                                 .orElseThrow(() -> new NotFoundException(ErrorsEnums.USUARIO_NOT_FOUND_ERROR.getDescription() + postulacion.getUsuario() ));

                                adopcionRepository.findById(p.getAdopcion())
                                                    .orElseThrow( () -> new NotFoundException(ErrorsEnums.ADOPCION_NOT_FOUND_ERROR.getDescription() + postulacion.getAdopcion()));

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


    public List<PostulacionDTO> getAllPostulacionesByUsuario(Long  usuarioId){

       return Optional.of(usuarioId)
                .map(usuario ->{
                            usuarioRepository.findById(usuario)
                                             .orElseThrow(
                                                       () -> new NotFoundException(ErrorsEnums.USUARIO_NOT_FOUND_ERROR.getDescription() + usuario )
                                             );

                           return postulacionRepository.findPostulacionesByUsuarioId(usuarioId)
                                    .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()) );
                        }
                )
                .map(
                        postulaciones -> postulacionMapper.toPostulacionDTOList(postulaciones)
                ).orElseThrow(RuntimeException::new);
    }
}