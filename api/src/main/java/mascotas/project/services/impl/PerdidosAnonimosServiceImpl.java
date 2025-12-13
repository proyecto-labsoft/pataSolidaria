package mascotas.project.services.impl;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mascotas.project.dto.ExtravioRequestDTO;
import mascotas.project.dto.MascotaDTORequest;
import mascotas.project.dto.MascotaDTOSaveSucces;
import mascotas.project.dto.PerdidoSinFamiliarDTO;
import mascotas.project.services.interfaces.ExtravioService;
import mascotas.project.services.interfaces.MascotaService;
import mascotas.project.services.interfaces.PerdidosAnonimosService;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
public class PerdidosAnonimosServiceImpl implements PerdidosAnonimosService {

    private final ExtravioService extravioService;
    private final MascotaService mascotaService;

    @Override
    @Transactional
    public void savePerdidosAnonimos(PerdidoSinFamiliarDTO perdido) {

        ExtravioRequestDTO extravio = perdido.getDatosExtravio();
        MascotaDTORequest mascotaRequest = perdido.getDatosMascota();

        MascotaDTOSaveSucces mascotaEntity = mascotaService.saveMascotaSinFamiliar(mascotaRequest);

        extravio.setMascotaId( mascotaEntity.getId() );

        extravioService.saveExtravio(extravio, Boolean.TRUE);
    }
}