package mascotas.project.repositories;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.entities.Extravio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExtravioRepository extends JpaRepository<Extravio, Long> {


    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.mascota,
        m.nombre,
        e.zona,
        e.hora,
        e.observacion,
        e.atencion_medica,
        e.resuelto,
        e.latitud,
        e.longitud,
        e.direccion
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    WHERE e.creador = :usuario
""")
    List<ExtravioDetailDTO> findAllByCreador(@Param("usuario") Long usuario);

    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.mascota,
        m.nombre,
        e.zona,
        e.hora,
        e.observacion,
        e.atencion_medica,
        e.resuelto,
        e.latitud,
        e.longitud,
        e.direccion
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    WHERE e.resuelto = :resueltos
    """)
    List<ExtravioDetailDTO> findAllByResuelto(@Param("resueltos") Boolean resueltos);


    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.mascota,
        m.nombre,
        e.zona,
        e.hora,
        e.observacion,
        e.atencion_medica,
        e.resuelto,
        e.latitud,
        e.longitud,
        e.direccion
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    """)
    List<ExtravioDetailDTO> findAllWithMascota();


}
