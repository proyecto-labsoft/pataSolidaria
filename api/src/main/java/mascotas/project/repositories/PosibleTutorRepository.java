package mascotas.project.repositories;

import mascotas.project.entities.PosibleTutor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PosibleTutorRepository extends JpaRepository<PosibleTutor, Long> {


    List<PosibleTutor> findAllByExtravioIdOrderByHoraDesc(Long extravioId);


}
