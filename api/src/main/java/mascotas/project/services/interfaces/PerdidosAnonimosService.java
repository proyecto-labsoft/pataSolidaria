package mascotas.project.services.interfaces;

import mascotas.project.dto.PerdidoSinFamiliarDTO;
import org.springframework.stereotype.Service;

@Service
public interface PerdidosAnonimosService {

    void savePerdidosAnonimos(PerdidoSinFamiliarDTO perdido);
}
