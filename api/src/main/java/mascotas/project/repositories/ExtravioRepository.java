package mascotas.project.repositories;

import mascotas.project.dto.ExtravioDetailDTO;
import mascotas.project.entities.Extravio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ExtravioRepository extends JpaRepository<Extravio, Long> {

    //TODO: eliminar la creacion de dto en query

    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.id,
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.ultimoAvistamiento,
        e.observacion,
        e.resuelto,
        e.creadoByFamiliar,
        null,
        e.latitud,
        e.longitud,
        e.direccion
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    WHERE e.creador = :usuario
    AND e.resuelto = :resueltos
    ORDER BY e.ultimoAvistamiento DESC
""")
    List<ExtravioDetailDTO> findAllByCreadorAndResuelto(@Param("usuario") Long usuario, @Param("resueltos") Boolean resueltos);


    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.id,
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.ultimoAvistamiento,
        e.observacion,
        e.resuelto,
        e.creadoByFamiliar,
        null,
        e.latitud,
        e.longitud,
        e.direccion
    )
    FROM Extravio e
    WHERE e.creador = :usuario
    ORDER BY e.ultimoAvistamiento DESC
""")
    List<ExtravioDetailDTO> findAllByCreador(@Param("usuario") Long usuario);

    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.id,
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.ultimoAvistamiento,
        e.observacion,
        e.resuelto,
        e.creadoByFamiliar,
        null,
        e.latitud,
        e.longitud,
        e.direccion
    )
    FROM Extravio e
    JOIN Mascota m ON e.mascota = m.id
    WHERE e.resuelto = :resueltos
    ORDER BY e.ultimoAvistamiento DESC
    """)
    List<ExtravioDetailDTO> findAllByResuelto(@Param("resueltos") Boolean resueltos);

    @Query("""
    SELECT new mascotas.project.dto.ExtravioDetailDTO(
        e.id,
        e.creador,
        e.mascota,
        e.zona,
        e.hora,
        e.ultimoAvistamiento,
        e.observacion,
        e.resuelto,
        e.creadoByFamiliar,
        null,
        e.latitud,
        e.longitud,
        e.direccion
    )
    FROM Extravio e
    ORDER BY e.ultimoAvistamiento DESC
    """)
    List<ExtravioDetailDTO> findAllExtravio();


    Optional<Extravio> findByMascotaAndResueltoIsFalse(Long mascota);


    List<Extravio> findAllByIdInOrderByUltimoAvistamientoDesc(Collection<Long> ids);
}
