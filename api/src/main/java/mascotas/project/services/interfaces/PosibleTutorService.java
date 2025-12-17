package mascotas.project.services.interfaces;

import mascotas.project.dto.PosibleTutorDetail;
import mascotas.project.dto.PosibleTutorRequest;
import mascotas.project.entities.PosibleTutor;

import java.util.List;

public interface PosibleTutorService {


    PosibleTutor savePosibleTutor(PosibleTutorRequest request);
    List<PosibleTutorDetail> getPosiblesTutores(Long extravioId);
}