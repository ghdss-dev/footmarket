package br.com.gustavo.footmarket.back_end.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PartidasRequest(

        @NotNull(message = "O clube mandante é obrigatório.")
        @Positive(message = "O ID do clube mandante deve ser positivo")
        Integer homeClubId,

        @NotNull(message = "O clube visitante é obrigatório.")
        @Positive(message = "O ID do clube visitante deve ser positivo.")
        Integer awayClubId

) {
}
