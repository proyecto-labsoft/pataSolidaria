package mascotas.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mascotas.project.dto.ImagenDTO;
import mascotas.project.dto.ImagenUploadResponseDTO;
import mascotas.project.services.ImagenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/imagenes")
@RequiredArgsConstructor
@Tag(name = "Imágenes", description = "Gestión de imágenes para mascotas, adopciones, extravíos, avistamientos y emergencias")
public class ImagenController {

    private final ImagenService imagenService;

    // ========== MASCOTAS ==========

    @PostMapping(value = "/mascota/{mascotaId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir imagen de mascota", description = "Sube una imagen asociada a una mascota")
    public ResponseEntity<ImagenUploadResponseDTO> subirImagenMascota(
            @Parameter(description = "Archivo de imagen") @RequestParam("file") MultipartFile file,
            @Parameter(description = "ID de la mascota") @PathVariable Long mascotaId
    ) throws IOException {
        ImagenUploadResponseDTO response = imagenService.subirImagenMascota(file, mascotaId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mascota/{mascotaId}")
    @Operation(summary = "Obtener imágenes de mascota", description = "Obtiene todas las imágenes de una mascota")
    public ResponseEntity<List<ImagenDTO>> obtenerImagenesMascota(
            @Parameter(description = "ID de la mascota") @PathVariable Long mascotaId
    ) {
        List<ImagenDTO> imagenes = imagenService.obtenerImagenesMascota(mascotaId);
        return ResponseEntity.ok(imagenes);
    }

    // ========== EXTRAVÍOS ==========

    @PostMapping(value = "/extravio/{extravioId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir imagen de extravío", description = "Sube una imagen asociada a un extravío")
    public ResponseEntity<ImagenUploadResponseDTO> subirImagenExtravio(
            @Parameter(description = "Archivo de imagen") @RequestParam("file") MultipartFile file,
            @Parameter(description = "ID del extravío") @PathVariable Long extravioId
    ) throws IOException {
        ImagenUploadResponseDTO response = imagenService.subirImagenExtravio(file, extravioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/extravio/{extravioId}")
    @Operation(summary = "Obtener imágenes de extravío", description = "Obtiene todas las imágenes de un extravío")
    public ResponseEntity<List<ImagenDTO>> obtenerImagenesExtravio(
            @Parameter(description = "ID del extravío") @PathVariable Long extravioId
    ) {
        List<ImagenDTO> imagenes = imagenService.obtenerImagenesExtravio(extravioId);
        return ResponseEntity.ok(imagenes);
    }

    // ========== AVISTAMIENTOS ==========

    @PostMapping(value = "/avistamiento/{avistamientoId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir imagen de avistamiento", description = "Sube una imagen asociada a un avistamiento")
    public ResponseEntity<ImagenUploadResponseDTO> subirImagenAvistamiento(
            @Parameter(description = "Archivo de imagen") @RequestParam("file") MultipartFile file,
            @Parameter(description = "ID del avistamiento") @PathVariable Long avistamientoId
    ) throws IOException {
        ImagenUploadResponseDTO response = imagenService.subirImagenAvistamiento(file, avistamientoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/avistamiento/{avistamientoId}")
    @Operation(summary = "Obtener imágenes de avistamiento", description = "Obtiene todas las imágenes de un avistamiento")
    public ResponseEntity<List<ImagenDTO>> obtenerImagenesAvistamiento(
            @Parameter(description = "ID del avistamiento") @PathVariable Long avistamientoId
    ) {
        List<ImagenDTO> imagenes = imagenService.obtenerImagenesAvistamiento(avistamientoId);
        return ResponseEntity.ok(imagenes);
    }

    // ========== ADOPCIONES ==========

    @PostMapping(value = "/adopcion/{adopcionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir imagen de adopción", description = "Sube una imagen asociada a una adopción")
    public ResponseEntity<ImagenUploadResponseDTO> subirImagenAdopcion(
            @Parameter(description = "Archivo de imagen") @RequestParam("file") MultipartFile file,
            @Parameter(description = "ID de la adopción") @PathVariable Long adopcionId
    ) throws IOException {
        ImagenUploadResponseDTO response = imagenService.subirImagenAdopcion(file, adopcionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/adopcion/{adopcionId}")
    @Operation(summary = "Obtener imágenes de adopción", description = "Obtiene todas las imágenes de una adopción")
    public ResponseEntity<List<ImagenDTO>> obtenerImagenesAdopcion(
            @Parameter(description = "ID de la adopción") @PathVariable Long adopcionId
    ) {
        List<ImagenDTO> imagenes = imagenService.obtenerImagenesAdopcion(adopcionId);
        return ResponseEntity.ok(imagenes);
    }

    // ========== EMERGENCIAS ==========

    @PostMapping(value = "/emergencia/{emergenciaId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir imagen de emergencia", description = "Sube una imagen asociada a una emergencia")
    public ResponseEntity<ImagenUploadResponseDTO> subirImagenEmergencia(
            @Parameter(description = "Archivo de imagen") @RequestParam("file") MultipartFile file,
            @Parameter(description = "ID de la emergencia") @PathVariable Long emergenciaId
    ) throws IOException {
        ImagenUploadResponseDTO response = imagenService.subirImagenEmergencia(file, emergenciaId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/emergencia/{emergenciaId}")
    @Operation(summary = "Obtener imágenes de emergencia", description = "Obtiene todas las imágenes de una emergencia")
    public ResponseEntity<List<ImagenDTO>> obtenerImagenesEmergencia(
            @Parameter(description = "ID de la emergencia") @PathVariable Long emergenciaId
    ) {
        List<ImagenDTO> imagenes = imagenService.obtenerImagenesEmergencia(emergenciaId);
        return ResponseEntity.ok(imagenes);
    }

    // ========== OPERACIONES GENERALES ==========

    @DeleteMapping("/{imagenId}")
    @Operation(summary = "Eliminar imagen", description = "Elimina una imagen de Firebase Storage y de la base de datos")
    public ResponseEntity<Void> eliminarImagen(
            @Parameter(description = "ID de la imagen") @PathVariable Long imagenId
    ) {
        imagenService.eliminarImagen(imagenId);
        return ResponseEntity.noContent().build();
    }
}
