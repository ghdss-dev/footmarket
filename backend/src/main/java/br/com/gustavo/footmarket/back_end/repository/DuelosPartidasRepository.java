package br.com.gustavo.footmarket.back_end.repository;

import br.com.gustavo.footmarket.back_end.entity.DuelosPartidas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DuelosPartidasRepository extends JpaRepository<DuelosPartidas, Integer> {

    // Os 6 duelos da partida na ordem da RN20 (1 a 6)
    List<DuelosPartidas> findByPartidaIdOrderByOrdemAsc(Integer partidaId);
}