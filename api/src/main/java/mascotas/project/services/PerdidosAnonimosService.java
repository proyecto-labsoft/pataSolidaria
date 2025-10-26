package mascotas.project.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.dto.PerdidoSinFamiliarDTO;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
public class PerdidosAnonimosService {

    private final ExtravioService extravioService;
    private final MascotaService mascotaService;

    @Transactional
    public void savePerdidosAnonimos(PerdidoSinFamiliarDTO perdido) {

        ExtravioRequestDTO extravio = perdido.getDatosExtravio();
        MascotaDTORequest mascotaRequest = perdido.getDatosMascota();

        //tengo que mapear la mascota, persistirla
        MascotaDTOSaveSucces mascotaEntity = mascotaService.saveMascotaSinFamiliar(mascotaRequest);
        perdido.getDatosExtravio().setMascotaId(  mascotaEntity.getId() );

        extravioService.saveExtravio(extravio);
        //tengo que mapear el extravio, persistirlo

    }
}