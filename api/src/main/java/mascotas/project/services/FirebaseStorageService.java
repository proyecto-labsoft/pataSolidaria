package mascotas.project.services;

import com.google.cloud.storage.*;
import com.google.firebase.cloud.StorageClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class FirebaseStorageService {

    private static final String BUCKET_NAME = "pata-solidaria-fb7d8.firebasestorage.app";
    private static final long URL_EXPIRATION_DAYS = 365; // URLs válidas por 1 año

    /**
     * Sube un archivo a Firebase Storage
     * 
     * @param file Archivo a subir
     * @param carpeta Carpeta destino (ej: "mascotas", "extravios", "avistamientos")
     * @param entidadId ID de la entidad relacionada
     * @return Ruta completa del archivo en Storage
     */
    public String subirArchivo(MultipartFile file, String carpeta, Long entidadId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        // Generar nombre único para el archivo
        String extension = obtenerExtension(file.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID().toString() + extension;
        String rutaCompleta = String.format("%s/%d/%s", carpeta, entidadId, nombreArchivo);

        // Obtener el bucket
        Bucket bucket = StorageClient.getInstance().bucket(BUCKET_NAME);
        
        // Configurar el BlobInfo
        BlobId blobId = BlobId.of(BUCKET_NAME, rutaCompleta);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        // Subir el archivo
        Storage storage = bucket.getStorage();
        storage.create(blobInfo, file.getBytes());

        log.info("Archivo subido exitosamente a Firebase Storage: {}", rutaCompleta);
        return rutaCompleta;
    }

    /**
     * Obtiene una URL pública temporal para acceder al archivo
     * 
     * @param rutaStorage Ruta del archivo en Storage
     * @return URL pública con firma
     */
    public String obtenerUrlPublica(String rutaStorage) {
        try {
            Bucket bucket = StorageClient.getInstance().bucket(BUCKET_NAME);
            Blob blob = bucket.get(rutaStorage);
            
            if (blob == null) {
                throw new IllegalArgumentException("Archivo no encontrado en Storage: " + rutaStorage);
            }

            // Generar URL firmada válida por 1 año
            URL url = blob.signUrl(URL_EXPIRATION_DAYS, TimeUnit.DAYS);
            return url.toString();
        } catch (Exception e) {
            log.error("Error al obtener URL pública para: {}", rutaStorage, e);
            throw new RuntimeException("Error al generar URL pública", e);
        }
    }

    /**
     * Elimina un archivo de Firebase Storage
     * 
     * @param rutaStorage Ruta del archivo en Storage
     * @return true si se eliminó correctamente
     */
    public boolean eliminarArchivo(String rutaStorage) {
        try {
            Bucket bucket = StorageClient.getInstance().bucket(BUCKET_NAME);
            Blob blob = bucket.get(rutaStorage);
            
            if (blob != null) {
                boolean deleted = blob.delete();
                log.info("Archivo eliminado de Firebase Storage: {}", rutaStorage);
                return deleted;
            }
            
            log.warn("Archivo no encontrado para eliminar: {}", rutaStorage);
            return false;
        } catch (Exception e) {
            log.error("Error al eliminar archivo de Storage: {}", rutaStorage, e);
            return false;
        }
    }

    /**
     * Valida que el archivo sea una imagen
     * 
     * @param file Archivo a validar
     * @return true si es una imagen válida
     */
    public boolean esImagenValida(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            return false;
        }

        return contentType.startsWith("image/") && 
               (contentType.equals("image/jpeg") || 
                contentType.equals("image/png") || 
                contentType.equals("image/jpg") ||
                contentType.equals("image/webp"));
    }

    /**
     * Valida el tamaño del archivo (máximo 5MB)
     * 
     * @param file Archivo a validar
     * @return true si el tamaño es válido
     */
    public boolean esTamanioValido(MultipartFile file) {
        long maxSize = 5 * 1024 * 1024; // 5MB
        return file.getSize() <= maxSize;
    }

    /**
     * Obtiene la extensión del archivo
     * 
     * @param nombreArchivo Nombre del archivo
     * @return Extensión con punto (ej: ".jpg")
     */
    private String obtenerExtension(String nombreArchivo) {
        if (nombreArchivo == null || !nombreArchivo.contains(".")) {
            return ".jpg"; // Extensión por defecto
        }
        return nombreArchivo.substring(nombreArchivo.lastIndexOf("."));
    }
}
