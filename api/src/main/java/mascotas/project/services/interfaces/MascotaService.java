package mascotas.project.services.interfaces;

import mascotas.project.dto.MascotaDTODetail;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.entities.Mascota;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MascotaService {

    MascotaDTOSaveSucces saveMascota(MascotaDTORequest mascotaDTORequest);

    MascotaDTOSaveSucces saveMascotaSinFamiliar(MascotaDTORequest mascotaDTORequest);

    MascotaDTOSaveSucces putMascota(Long idMascota, MascotaDTORequest mascotaDTORequest);

    MascotaDTODetail getMascotaById(Long id);

    List<MascotaDTODetail> getMascotasByFamiliarId(Long usuarioId);

    Mascota getMascotaEntityById(Long id);

    void deleteCompaniero(Long id);
}
