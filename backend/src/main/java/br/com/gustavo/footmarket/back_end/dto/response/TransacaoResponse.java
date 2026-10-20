package br.com.gustavo.footmarket.back_end.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransacaoResponse(

        Integer id,
        Integer clubeId,
        Integer jogadorId,
        String nomeJogador,
        String tipo,
        BigDecimal valor,
        BigDecimal taxa,
        BigDecimal multa,
        BigDecimal lucro,
        BigDecimal variacaoCaixa,
        LocalDateTime criadoEm
) {
}
