package br.com.gustavo.footmarket.back_end.repository;

import br.com.gustavo.footmarket.back_end.entity.Clube;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubeRepository extends JpaRepository<Clube, Integer> {

    Optional<Clube> findByNomeNormalizado(String nomeNormalizado);

    boolean existsByNomeNormalizado(String nomeNormalizado);

    boolean existsBySigla(String sigla);

    boolean existsByNomeNormalizadoAndIdNot(

           String nomeNormalizado,
           Integer id
    );

    boolean existsBySiglaAndIdNot(String sigla, Integer id);
}
