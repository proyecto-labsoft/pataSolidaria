package mascotas.project.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.PostulacionDTO;
import mascotas.project.entities.Postulacion;
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
                                                 .orElseThrow(
                                                         () -> new IllegalArgumentException("No se encontró al usuario con ID: " + postulacion.getUsuario())
                                                 );

                                adopcionRepository.findById(p.getAdopcion())
                                                    .orElseThrow(
                                                            () -> new IllegalArgumentException("No se encontró la adopcion con ID: " + postulacion.getAdopcion())
                                                    );

                                return postulacionMapper.toPostulacionEntity(postulacion);
                            }
                     )
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
                .map(
                        usuario ->{

                                usuarioRepository.findById(usuario)
                                                 .orElseThrow(
                                                           () -> new IllegalArgumentException("No se encontró al usuario con ID: " + usuarioId)
                                                 );

                           return postulacionRepository.findPostulacionesByUsuarioId(usuarioId)
                                    .orElseThrow(
                                            () -> new IllegalArgumentException("No se encontraron posutlaciones para el usuario con ID: " + usuarioId)
                                    );
                        }
                )
                .map(
                        postulaciones -> postulacionMapper.toPostulacionDTOList(postulaciones)
                ).orElseThrow(RuntimeException::new);
    }
}