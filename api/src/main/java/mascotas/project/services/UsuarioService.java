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
                .orElseThrow(() -> new NotFoundException(ErrorsEnums.USUARIO_NOT_FOUND.getDescription() + idUsuario ));

        return  usuarioMapper.toUsuarioDto(usuario);
    }

    @Transactional
    public UsuarioDTO createUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);
        Usuario savedUsuario = usuarioRepository.save(usuario);
        return usuarioMapper.toUsuarioDto(savedUsuario);
    }

}
