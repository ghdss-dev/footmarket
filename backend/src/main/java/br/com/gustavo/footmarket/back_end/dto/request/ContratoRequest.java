package br.com.gustavo.footmarket.back_end.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ContratoRequest(

        @NotNull(message = "O jogador é obrigatório.")
        @Positive(message = "O ID do jogador deve ser positivo")
        Integer jogadorId,

        @NotNull(message = "O jogador é obrigatório.")
        @Positive(message = "O ID do clube deve ser positivo")
        Integer clubeId,

        @NotNull(message = "O valor da compra é obrigatório.")
        @Positive(message = "O valor da compra deve ser maior que zero")
        @Digits(integer = 8, fraction = 2, message = "O valor da compra deve ter no máximo 2 casas decímais")
        BigDecimal valorCompra,

        @NotNull(message = "O fim da fidelidade é obrigatório.")
        LocalDateTime fidelidadeAte
) {
}
