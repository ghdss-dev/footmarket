package br.com.gustavo.footmarket.back_end.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Partida no formato do enunciado (2.4.2). Os nomes JSON ficam em inglês e snake_case;
 * "duels" só vem no POST e em GET /matches/{id}, e a listagem omite o campo.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PartidasResponse(

        Integer id,
        @JsonProperty("played_at") String jogadaEm,
        @JsonProperty("home") TimeResponse mandante,
        @JsonProperty("away") TimeResponse visitante,
        @JsonProperty("result") String resultado,
        @JsonProperty("duels") List<DueloResponse> duelos
) {

    public record TimeResponse(

            @JsonProperty("club_id") Integer clubeId,
            @JsonProperty("club_name") String nomeClube,
            @JsonProperty("formation") String formacao,
            @JsonProperty("goals") Integer gols
    ) {
    }

    public record ParticipanteResponse(

            @JsonProperty("player_id") Integer jogadorId,
            @JsonProperty("player_name") String nome,
            @JsonProperty("position") String posicao,
            @JsonProperty("condition") String condicao,
            @JsonProperty("attribute") String atributo,
            @JsonProperty("value") Integer valor
    ) {
    }

    public record DueloResponse(

            @JsonProperty("order") Integer ordem,
            @JsonProperty("attacking_club_id") Integer clubeAtacanteId,
            @JsonProperty("attacker") ParticipanteResponse atacante,
            @JsonProperty("defender") ParticipanteResponse defensor,
            @JsonProperty("goal") Boolean gol
    ) {
    }
}
