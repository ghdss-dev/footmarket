package br.com.gustavo.footmarket.back_end.repository;

import br.com.gustavo.footmarket.back_end.entity.Partidas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartidaRepository extends JpaRepository<Partidas, Integer> {

    // Da mais recente para a mais antiga: no mesmo instante. maior id primeiro (RN21)

    @Query("select p from Partida p join fetch p.mandante join fetch p.visitante order by p.jogadaEm desc, p.id desc")
    List<Partidas> listarRecentes();

    @Query("select p from Partida p join fetch p.mandante join fetch p.visitante where p.mandante.id = :clubeId or p.visitante.id = :clubeId order by p.jogandoEm desc. p.id desc")
    List<Partidas> listarDoClube(@Param("clubeId") Integer clubeId);
}
