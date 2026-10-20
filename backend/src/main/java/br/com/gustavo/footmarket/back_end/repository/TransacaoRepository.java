package br.com.gustavo.footmarket.back_end.repository;

import br.com.gustavo.footmarket.back_end.entity.Transacao;
import jakarta.persistence.Entity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Ordem do historico (RN17): da mais recente para a mais antiga: empate, id decrescente
    @EntityGraph(attributePaths = {"clube", "jogador"})
    List<Transacao> findAllByOrderByCriadoEmDescIdDesc();

    @EntityGraph(attributePaths = {"clube", "jogador"})
    List<Transacao> findByClubeIdOrderByCriadoEmDescIdDesc(Integer clubeId);

    // Usado na compra (RN!2): um clube não recompra um jogador que ele mesmo vende
    boolean existsByClubeIdAndJogadorIdAndTipo(Integer clubeId, Integer jogadorId, String tipo);
}
