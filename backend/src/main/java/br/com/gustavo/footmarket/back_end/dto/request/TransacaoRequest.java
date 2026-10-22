package br.com.gustavo.footmarket.back_end.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record TransacaoRequest(

        @NotNull(message = "O clube é obrigatório.")
        @Positive(message = "O ID do clube deve ser positivo")
        Integer clubeId,

        @NotNull(message = "O jogador é obrigatório.")
        @Positive(message = "O ID do clube deve ser positivo")
        Integer jogadorId,

        @NotBlank(message = "O tipo é obrigatório.")
        @Pattern(regexp = "COMPRA|VENDA", message = "Tipo inválido. Use COMPRA ou VENDA.")
        String tipo,

        @NotNull(message = "O valor é obrigatório.")
        @Positive(message = "O valor deve ser maior que zero.")
        @Digits(integer = 8, fraction = 2, message = "O valor deve ter no máximo 2 casas decímais.")
        BigDecimal valor,

        // Taxa de compra ou comissão de venda.
        @NotNull(message = "A taxa ou comissão é obrigatória.")
        @PositiveOrZero(message = "A taxa ou comissão não pode ser negativa.")
        @Digits(integer = 8, fraction = 2, message = "A taxa ou comissão deve ter no máximo 2 casas decimais.")
        BigDecimal taxa,

        // So na venda, na compra e ignorada (fica 0,00).
        @PositiveOrZero(message = "A multa não pode ser negativa. ")
        @Digits(integer = 4, fraction = 2, message = "A multa deve ter no máximo 2 casas decimais")
        BigDecimal multa,

        // So na venda (obrigatorio); pode ser negativo. Na compra e ignorado (fica nulo)
        @Digits(integer = 5, fraction = 2, message = "O lucro deve ter no máximo 2 casas decímais.")
        BigDecimal lucro
) {
}
