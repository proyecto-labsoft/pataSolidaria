package mascotas.project.services.impl;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.PostulacionRequestDTO;
import mascotas.project.entities.Postulacion;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.mapper.PostulacionMapper;
import mascotas.project.repositories.PostulacionRepository;
import mascotas.project.services.interfaces.AdopcionService;
import mascotas.project.services.interfaces.PostulacionService;
import mascotas.project.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class PostulacionServiceImpl implements PostulacionService {

    private final PostulacionRepository postulacionRepository;
    private final PostulacionMapper postulacionMapper;
    private final UsuarioService usuarioService;
    private final AdopcionService adopcionService;


    @Override
    @Transactional
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

    @Override
    public List<PostulacionRequestDTO> getAllPostulacionesByUsuario(Long  usuarioId){

       return Optional.of(usuarioId)
                .map(usuario ->{

                    usuarioService.getUsuarioById(usuario);

                   return postulacionRepository.findPostulacionesByUsuarioId(usuarioId)
                            .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()) );

                })
                .filter(lista -> !lista.isEmpty())
                .map(postulacionMapper::toPostulacionDTOList)
                .orElseThrow( () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription()));
    }

    @Override
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