package br.com.gustavo.footmarket.back_end.dto.request;

import jakarta.validation.constraints.*;

import java.util.List;

public record EscalacaoRequest(

        @NotBlank(message = "A formação é obrigatória.")
        @Pattern(
                regexp = "3-1|2-2|2-1-1|1-2-1",
                message = "Formação inválida. Use 3-1, 2-2, 2-1-1 ou 1-2-1."
        )

        String formacao,

        @NotNull(message = "A lista de jogadores é obrigatória.")
        @Size(min = 5, max = 5,message = "A escalação deve ter exatamente 5 jogadores")
        List<@NotNull(message = "O ID jogador é obrigatório.")
        @Positive(message = "O ID do jogador deve ser positivo")
                Integer> jogadorIds
) {
}
