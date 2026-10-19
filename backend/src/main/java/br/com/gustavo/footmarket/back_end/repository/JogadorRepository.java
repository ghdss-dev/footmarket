package br.com.gustavo.footmarket.back_end.repository;

import br.com.gustavo.footmarket.back_end.entity.Jogador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JogadorRepository extends JpaRepository<Jogador, Integer> {

    List<Jogador> findByExcluidoEmIsNull();

    Optional<Jogador> findByIdAndExcluidoEmIsNull(Integer id);
}
