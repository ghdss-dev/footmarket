package br.com.gustavo.footmarket.back_end.repository;

import br.com.gustavo.footmarket.back_end.entity.Contrato;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Integer> {

    @EntityGraph(attributePaths = {"jogador", "clube"})
    List<Contrato> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"jogador", "clube"})
    Optional<Contrato> findByJogadorIdAndSituacao(Integer jogadorId, String situacao);

    boolean existsByJogadorIdAndSituacao(Integer jogadorId, String situacao);
}
