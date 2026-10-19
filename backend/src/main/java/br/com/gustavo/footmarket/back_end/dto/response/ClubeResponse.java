package br.com.gustavo.footmarket.back_end.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ClubeResponse(

        Integer id,
        String nome,
        String sigla,
        BigDecimal caixa,
        String formacao,
        LocalDateTime criadoEm
) {

}
