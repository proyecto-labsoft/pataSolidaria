package mascotas.project.services.impl;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.Enums.ErrorsEnums;
import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.dto.ExtravioFavRequestDTO;
import mascotas.project.entities.ExtravioFavorito;
import mascotas.project.exceptions.ForbiddenException;
import mascotas.project.exceptions.NoContentException;
import mascotas.project.repositories.ExtravioFavRepository;
import mascotas.project.services.interfaces.ExtravioFavService;
import mascotas.project.services.interfaces.ExtravioService;
import org.springframework.stereotype.Service;
import mascotas.project.services.interfaces.UsuarioService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class ExtravioFavServiceImpl implements ExtravioFavService {

    private final UsuarioService usuarioService;
    private final ExtravioService extravioService;
    private final ExtravioFavRepository repository;


    @Override
    @Transactional
    public void saveExtravioFav(ExtravioFavRequestDTO request){

        //validaciones del request
        usuarioService.getUsuarioById(request.getUsuarioId());
        extravioService.getExtravioEntityById(request.extravioId);

        //valido que no exista
        Optional.ofNullable( repository.findByUsuarioIdAndExtravioId(request.getUsuarioId(), request.getExtravioId()) )
                .ifPresent( extravioFav -> { throw new ForbiddenException(ErrorsEnums.EXTRAVIO_FAVORITO_FORBIDDEN_ERROR.getDescription() + request.getExtravioId() );});


        ExtravioFavorito extFav = ExtravioFavorito.builder()
                                                    .extravioId(request.getExtravioId())
                                                    .usuarioId(request.getUsuarioId())
                                                    .build();

        log.info("SAVE_EXTRAVIO_FAVORITO: {}", extFav.toString());
        repository.save(extFav);

    }

    @Override
    public List<ExtravioDetailDTO> getExtFavoritosByUser(Long usuarioId){

        usuarioService.getUsuarioById(usuarioId);

        List<ExtravioFavorito> favoritos = Optional.of(repository.findAllByUsuarioId(usuarioId))
                                                        .filter(extravioFavoritos -> !extravioFavoritos.isEmpty() )
                                                        .orElseThrow(
                                                                () -> new NoContentException(ErrorsEnums.NO_CONTENT_ERROR.getDescription())
                                                        );

        List<Long> favoritosId = new ArrayList<>();

        //obtengo los ids de favoritos
        favoritos.forEach(  favorito -> favoritosId.add( favorito.getExtravioId() ) );

        List<ExtravioDetailDTO> extraviosFavoritos = extravioService.getAllExtraviosByIds(favoritosId);

        return extraviosFavoritos;
    }

    @Override
    public Boolean isFavorito(ExtravioFavRequestDTO request){
        //validaciones del request
        usuarioService.getUsuarioById(request.getUsuarioId());
        extravioService.getExtravioEntityById(request.getExtravioId());


        Optional<ExtravioFavorito> extFav = Optional.ofNullable(repository.findByUsuarioIdAndExtravioId(request.getUsuarioId(), request.getExtravioId()));

        return extFav.isPresent();
    }
}
