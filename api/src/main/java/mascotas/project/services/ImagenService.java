package mascotas.project.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.ImagenDTO;
import mascotas.project.dto.ImagenUploadResponseDTO;
import mascotas.project.entities.*;
import mascotas.project.exceptions.BadRequestException;
import mascotas.project.exceptions.NotFoundException;
import mascotas.project.mapper.ImagenMapper;
import mascotas.project.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImagenService {

    private final FirebaseStorageService firebaseStorageService;
    private final ImagenRepository imagenRepository;
    private final MascotaImagenRepository mascotaImagenRepository;
    private final ExtravioImagenRepository extravioImagenRepository;
    private final AvistamientoImagenRepository avistamientoImagenRepository;
    private final AdopcionImagenRepository adopcionImagenRepository;
    private final EmergenciaImagenRepository emergenciaImagenRepository;
    private final ImagenMapper imagenMapper;

    /**
     * Sube una imagen para una mascota
     */
    @Transactional
    public ImagenUploadResponseDTO subirImagenMascota(MultipartFile file, Long mascotaId) throws IOException {
        validarArchivo(file);
        
        String rutaStorage = firebaseStorageService.subirArchivo(file, "mascotas", mascotaId);
        String urlPublica = firebaseStorageService.obtenerUrlPublica(rutaStorage);
        
        Imagen imagen = crearImagen(file, rutaStorage, urlPublica);
        imagen = imagenRepository.save(imagen);
        
        // Obtener el siguiente orden
        int orden = mascotaImagenRepository.findByIdMascotaIdOrderByOrdenAsc(mascotaId).size();
        
        // Crear Mascota reference (solo necesitamos el ID)
        Mascota mascota = new Mascota();
        mascota.setId(mascotaId);
        
        MascotaImagen mascotaImagen = MascotaImagen.builder()
                .id(new MascotaImagen.MascotaImagenId(mascotaId, imagen.getId()))
                .mascota(mascota)
                .imagen(imagen)
                .orden(orden)
                .build();
        
        mascotaImagenRepository.save(mascotaImagen);
        
        log.info("Imagen subida para mascota {}: {}", mascotaId, imagen.getId());
        
        return ImagenUploadResponseDTO.builder()
                .imagenId(imagen.getId())
                .urlPublica(urlPublica)
                .rutaStorage(rutaStorage)
                .mensaje("Imagen subida exitosamente")
                .build();
    }

    /**
     * Sube una imagen para un extravío
     */
    @Transactional
    public ImagenUploadResponseDTO subirImagenExtravio(MultipartFile file, Long extravioId) throws IOException {
        validarArchivo(file);
        
        String rutaStorage = firebaseStorageService.subirArchivo(file, "extravios", extravioId);
        String urlPublica = firebaseStorageService.obtenerUrlPublica(rutaStorage);
        
        Imagen imagen = crearImagen(file, rutaStorage, urlPublica);
        imagen = imagenRepository.save(imagen);
        
        int orden = extravioImagenRepository.findByIdExtravioIdOrderByOrdenAsc(extravioId).size();
        
        // Crear Extravio reference (solo necesitamos el ID)
        Extravio extravio = new Extravio();
        extravio.setId(extravioId);
        
        ExtravioImagen extravioImagen = ExtravioImagen.builder()
                .id(new ExtravioImagen.ExtravioImagenId(extravioId, imagen.getId()))
                .extravio(extravio)
                .imagen(imagen)
                .orden(orden)
                .build();
        
        extravioImagenRepository.save(extravioImagen);
        
        log.info("Imagen subida para extravío {}: {}", extravioId, imagen.getId());
        
        return ImagenUploadResponseDTO.builder()
                .imagenId(imagen.getId())
                .urlPublica(urlPublica)
                .rutaStorage(rutaStorage)
                .mensaje("Imagen subida exitosamente")
                .build();
    }

    /**
     * Sube una imagen para un avistamiento
     */
    @Transactional
    public ImagenUploadResponseDTO subirImagenAvistamiento(MultipartFile file, Long avistamientoId) throws IOException {
        validarArchivo(file);
        
        String rutaStorage = firebaseStorageService.subirArchivo(file, "avistamientos", avistamientoId);
        String urlPublica = firebaseStorageService.obtenerUrlPublica(rutaStorage);
        
        Imagen imagen = crearImagen(file, rutaStorage, urlPublica);
        imagen = imagenRepository.save(imagen);
        
        int orden = avistamientoImagenRepository.findByIdAvistamientoIdOrderByOrdenAsc(avistamientoId).size();
        
        // Crear Avistamiento reference (solo necesitamos el ID)
        Avistamiento avistamiento = new Avistamiento();
        avistamiento.setId(avistamientoId);
        
        AvistamientoImagen avistamientoImagen = AvistamientoImagen.builder()
                .id(new AvistamientoImagen.AvistamientoImagenId(avistamientoId, imagen.getId()))
                .avistamiento(avistamiento)
                .imagen(imagen)
                .orden(orden)
                .build();
        
        avistamientoImagenRepository.save(avistamientoImagen);
        
        log.info("Imagen subida para avistamiento {}: {}", avistamientoId, imagen.getId());
        
        return ImagenUploadResponseDTO.builder()
                .imagenId(imagen.getId())
                .urlPublica(urlPublica)
                .rutaStorage(rutaStorage)
                .mensaje("Imagen subida exitosamente")
                .build();
    }

    /**
     * Obtiene todas las imágenes de una mascota
     */
    public List<ImagenDTO> obtenerImagenesMascota(Long mascotaId) {
        List<MascotaImagen> relaciones = mascotaImagenRepository.findByIdMascotaIdOrderByOrdenAsc(mascotaId);

        if (relaciones.isEmpty()) {
            return Collections.singletonList(crearImagenPlaceholder());
        }
        
        return relaciones.stream()
                .map(imagenMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las imágenes de un extravío
     */
    public List<ImagenDTO> obtenerImagenesExtravio(Long extravioId) {
        List<ExtravioImagen> relaciones = extravioImagenRepository.findByIdExtravioIdOrderByOrdenAsc(extravioId);

        if (relaciones.isEmpty()) {
            return Collections.singletonList(crearImagenPlaceholder());
        }

        return relaciones.stream()
                .map(imagenMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las imágenes de un avistamiento
     */
    public List<ImagenDTO> obtenerImagenesAvistamiento(Long avistamientoId) {
        List<AvistamientoImagen> relaciones = avistamientoImagenRepository.findByIdAvistamientoIdOrderByOrdenAsc(avistamientoId);

        if (relaciones.isEmpty()) {
            return Collections.singletonList(crearImagenPlaceholder());
        }

        return relaciones.stream()
                .map(imagenMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Sube una imagen para una adopción
     */
    @Transactional
    public ImagenUploadResponseDTO subirImagenAdopcion(MultipartFile file, Long adopcionId) throws IOException {
        validarArchivo(file);
        
        String rutaStorage = firebaseStorageService.subirArchivo(file, "adopciones", adopcionId);
        String urlPublica = firebaseStorageService.obtenerUrlPublica(rutaStorage);
        
        Imagen imagen = crearImagen(file, rutaStorage, urlPublica);
        imagen = imagenRepository.save(imagen);
        
        int orden = adopcionImagenRepository.findByIdAdopcionIdOrderByOrdenAsc(adopcionId).size();
        
        // Crear Adopcion reference (solo necesitamos el ID)
        Adopcion adopcion = new Adopcion();
        adopcion.setId(adopcionId);
        
        AdopcionImagen adopcionImagen = AdopcionImagen.builder()
                .id(new AdopcionImagen.AdopcionImagenId(adopcionId, imagen.getId()))
                .adopcion(adopcion)
                .imagen(imagen)
                .orden(orden)
                .build();
        
        adopcionImagenRepository.save(adopcionImagen);
        
        log.info("Imagen subida para adopción {}: {}", adopcionId, imagen.getId());
        
        return ImagenUploadResponseDTO.builder()
                .imagenId(imagen.getId())
                .urlPublica(urlPublica)
                .rutaStorage(rutaStorage)
                .mensaje("Imagen subida exitosamente")
                .build();
    }

    /**
     * Obtiene todas las imágenes de una adopción
     */
    public List<ImagenDTO> obtenerImagenesAdopcion(Long adopcionId) {
        List<AdopcionImagen> relaciones = adopcionImagenRepository.findByIdAdopcionIdOrderByOrdenAsc(adopcionId);

        if (relaciones.isEmpty()) {
            return Collections.singletonList(crearImagenPlaceholder());
        }

        return relaciones.stream()
                .map(imagenMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Sube una imagen para una emergencia
     */
    @Transactional
    public ImagenUploadResponseDTO subirImagenEmergencia(MultipartFile file, Long emergenciaId) throws IOException {
        validarArchivo(file);
        
        String rutaStorage = firebaseStorageService.subirArchivo(file, "emergencias", emergenciaId);
        String urlPublica = firebaseStorageService.obtenerUrlPublica(rutaStorage);
        
        Imagen imagen = crearImagen(file, rutaStorage, urlPublica);
        imagen = imagenRepository.save(imagen);
        
        int orden = emergenciaImagenRepository.findByIdEmergenciaIdOrderByOrdenAsc(emergenciaId).size();
        
        // Crear Emergencia reference (solo necesitamos el ID)
        Emergencia emergencia = new Emergencia();
        emergencia.setId(emergenciaId);
        
        EmergenciaImagen emergenciaImagen = EmergenciaImagen.builder()
                .id(new EmergenciaImagen.EmergenciaImagenId(emergenciaId, imagen.getId()))
                .emergencia(emergencia)
                .imagen(imagen)
                .orden(orden)
                .build();
        
        emergenciaImagenRepository.save(emergenciaImagen);
        
        log.info("Imagen subida para emergencia {}: {}", emergenciaId, imagen.getId());
        
        return ImagenUploadResponseDTO.builder()
                .imagenId(imagen.getId())
                .urlPublica(urlPublica)
                .rutaStorage(rutaStorage)
                .mensaje("Imagen subida exitosamente")
                .build();
    }

    /**
     * Obtiene todas las imágenes de una emergencia
     */
    public List<ImagenDTO> obtenerImagenesEmergencia(Long emergenciaId) {
        List<EmergenciaImagen> relaciones = emergenciaImagenRepository.findByIdEmergenciaIdOrderByOrdenAsc(emergenciaId);

        if (relaciones.isEmpty()) {
            return Collections.singletonList(crearImagenPlaceholder());
        }

        return relaciones.stream()
                .map(imagenMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Elimina una imagen
     */
    @Transactional
    public void eliminarImagen(Long imagenId) {
        Imagen imagen = imagenRepository.findById(imagenId)
                .orElseThrow(() -> new NotFoundException("Imagen no encontrada con ID: " + imagenId));
        
        // Eliminar relaciones eficientemente antes de eliminar la imagen
        // (Hibernate no siempre respeta el CASCADE de la BD)
        mascotaImagenRepository.deleteByIdImagenId(imagenId);
        extravioImagenRepository.deleteByIdImagenId(imagenId);
        avistamientoImagenRepository.deleteByIdImagenId(imagenId);
        adopcionImagenRepository.deleteByIdImagenId(imagenId);
        emergenciaImagenRepository.deleteByIdImagenId(imagenId);
        
        // Eliminar de Firebase Storage
        firebaseStorageService.eliminarArchivo(imagen.getRutaStorage());
        
        // Eliminar de la base de datos
        imagenRepository.delete(imagen);
        
        log.info("Imagen eliminada: {}", imagenId);
    }

    // ========== MÉTODOS PRIVADOS ==========

    /**
     * Crea un ImagenDTO placeholder para cuando no hay imágenes
     */
    private ImagenDTO crearImagenPlaceholder() {
        return ImagenDTO.builder()
                .id(0L)
                .urlPublica("https://firebasestorage.googleapis.com/v0/b/pata-solidaria-fb7d8.firebasestorage.app/o/pata-no-imagen-mediano.jpeg?alt=media&token=c119afdc-f9ba-436a-8448-da645dee7bdc")
                .nombreArchivo("pata-no-imagen-mediano.jpeg")
                .orden(0)
                .build();
    }
    
    private void validarArchivo(MultipartFile file) {
        if (!firebaseStorageService.esImagenValida(file)) {
            throw new BadRequestException("El archivo debe ser una imagen válida (JPEG, PNG, WEBP)");
        }
        
        if (!firebaseStorageService.esTamanioValido(file)) {
            throw new BadRequestException("El tamaño del archivo no debe superar 5MB");
        }
    }

    private Imagen crearImagen(MultipartFile file, String rutaStorage, String urlPublica) {
        return Imagen.builder()
                .nombreArchivo(file.getOriginalFilename())
                .rutaStorage(rutaStorage)
                .urlPublica(urlPublica)
                .tipoMime(file.getContentType())
                .tamanio(file.getSize())
                .fechaSubida(LocalDateTime.now())
                .build();
    }
}
