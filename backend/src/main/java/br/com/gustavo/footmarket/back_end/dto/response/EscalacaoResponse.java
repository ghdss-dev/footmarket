package br.com.gustavo.footmarket.back_end.dto.response;

import java.util.List;

public record EscalacaoResponse(

        Integer clubeId,
        String formacao,
        boolean completa,
        List<TitularResponse> jogadores
) {

    public record TitularResponse(

            Integer id,
            String nome,
            String posicao,
            String condicao,
            Integer agilidade,
            Integer idade,
            Integer velocidade,
            Integer finalizacao,
            Integer passe,
            Integer drible,
            Integer defesa,
            Integer fisico,
            Integer potencial) {

    }
}