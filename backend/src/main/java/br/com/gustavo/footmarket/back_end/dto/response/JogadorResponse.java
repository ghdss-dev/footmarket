package br.com.gustavo.footmarket.back_end.dto.response;

import org.springframework.cglib.core.Local;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record JogadorResponse(

        Integer id,
        String nome,
        String posicao,
        Integer agilidade,
        Integer idade,
        BigDecimal valorBase,
        String condicao,
        Integer clubeId,
        String nomeClube,
        Integer velocidade,
        Integer finalizacao,
        Integer passe,
        Integer drible,
        Integer defesa,
        Integer fisico,
        Integer potencial,
        LocalDateTime criadoEm,
        LocalDateTime atualizado
        ) {
}
