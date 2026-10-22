package br.com.gustavo.footmarket.back_end.dto.request;


import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record JogadorRequest(

        @NotBlank(message = "O nome é obrigatório.")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
        String nome,

        @NotBlank(message = "A posição é obrigatório.")
        @Pattern(
                regexp = "GOL|ZAG|MEI|ATA",
                message = "Posição inválido"
        )
        String posicao,

        @NotNull(message = "A agilidade é obrigatória.")
        @Min(value = 0, message = "A agilidade não pode ser negativa.")
        @Max(value = 100, message = "A agilidade não pode ultrapassar 100.")
        Integer agilidade,

        @NotNull(message = "A idade é obrigatória.")
        @Min(value = 1, message = "A idade mínima é 1 ano.")
        @Max(value = 100, message = "A idade máxima é 100 anos.")
        Integer idade,

        @NotNull(message = "O valor base é obrigatório")
        @Positive(message = "O valor base deve ser maior que zero")
        BigDecimal valorBase,

        @Pattern(
                regexp = "APTO|MAL_CONDICIONADO|DOENTE",
                message = "Condição inválida."
        )
        String condicao,

        @Positive(message=" O ID do clube deve ser positivo.")
        Integer clubeId,

        @NotNull @Min(0) @Max(100)
        Integer velocidade,

        @NotNull @Min(0) @Max(100)
        Integer finalizacao,

        @NotNull @Min(0) @Max(100)
        Integer passe,

        @NotNull @Min(0) @Max(100)
        Integer drible,

        @NotNull @Min(0) @Max(100)
        Integer defesa,

        @NotNull @Min(0) @Max(100)
        Integer fisico,

        @NotNull @Min(0) @Max(100)
        Integer potencial
) {
}
