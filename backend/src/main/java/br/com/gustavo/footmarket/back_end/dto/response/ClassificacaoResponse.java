package br.com.gustavo.footmarket.back_end.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Uma linha da classificação (2.4.3 do enunciado). */
public record ClassificacaoResponse(

        @JsonProperty("position") Integer posicao,
        @JsonProperty("club_id") Integer clubeId,
        @JsonProperty("club_name") String nomeClube,
        @JsonProperty("played") Integer jogos,
        @JsonProperty("wins") Integer vitorias,
        @JsonProperty("draws") Integer empates,
        @JsonProperty("losses") Integer derrotas,
        @JsonProperty("goals_for") Integer golsPro,
        @JsonProperty("goals_against") Integer golsContra,
        @JsonProperty("goal_difference") Integer saldoDeGols,
        @JsonProperty("points") Integer pontos
) {
}
