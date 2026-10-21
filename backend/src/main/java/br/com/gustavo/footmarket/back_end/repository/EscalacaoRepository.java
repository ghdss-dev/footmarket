package br.com.gustavo.footmarket.back_end.repository;

import br.com.gustavo.footmarket.back_end.embeddable.EscalacaoId;
import br.com.gustavo.footmarket.back_end.entity.Escalacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalacaoRepository extends JpaRepository<Escalacao, EscalacaoId> {

    @Query("""
           select e
           from Escalacao e
           join fetch e.jogador
           where e.id.clubeId = :clubeId
           """)
    List<Escalacao> findByClubeId(@Param("clubeId") Integer clubeId);

    @Modifying(flushAutomatically = true)
    @Query("delete from Escalacao e where e.id.clubeId = :clubeId")
    int apagarDoClube(@Param("clubeId") Integer clubeId);

    @Modifying(flushAutomatically = true)
    @Query("delete from Escalacao e where e.id.jogadorId = :jogadorId")
    int apagarDoJogador(@Param("jogadorId") Integer jogadorId);
}
