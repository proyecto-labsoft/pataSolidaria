package mascotas.project.repositories;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.entities.Extravio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExtravioRepository extends JpaRepository<Extravio, Long> {


    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.observacion,
        e.resuelto,
        null
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    WHERE e.creador = :usuario
    AND e.resuelto = :resueltos
""")
    List<ExtravioDetailDTO> findAllByCreadorAndResuelto(@Param("usuario") Long usuario, @Param("resueltos") Boolean resueltos);


    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.observacion,
        e.resuelto,
        null
    )
    FROM Extravio e
    WHERE e.creador = :usuario
""")
    List<ExtravioDetailDTO> findAllByCreador(@Param("usuario") Long usuario);

    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.observacion,
        e.resuelto,
        null
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    WHERE e.resuelto = :resueltos
    """)
    List<ExtravioDetailDTO> findAllByResuelto(@Param("resueltos") Boolean resueltos);


    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.observacion,
        e.resuelto,
        null
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    """)
    List<ExtravioDetailDTO> findAllWithMascota();


    Optional<Extravio> findByMascotaAndResueltoIsFalse(Long mascota);


}
