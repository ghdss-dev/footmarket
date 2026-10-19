package br.com.gustavo.footmarket.back_end.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ContratoResponse(

        Integer id,
        Integer jogadorId,
        String nomeJogador,
        Integer clubeId,
        String nomeClube,
        BigDecimal valorCompra,
        LocalDateTime fidelidadeAte,
        String situacao,
        LocalDateTime iniciadoEm,
        LocalDateTime encerradoEm

) {
}
