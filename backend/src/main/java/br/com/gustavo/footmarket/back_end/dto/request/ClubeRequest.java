package br.com.gustavo.footmarket.back_end.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ClubeRequest(

        @NotBlank(message = "O nome do clube é obrigatório")
        @Size(max = 60, message = "O nome deve ter no máximo 60 caracteres.")
        String nome,

        @NotBlank(message = "A sigla é obrigatória.")
        @Pattern(
                regexp = "[A-Za-z]{3}",
                message = "A sigla deve conter exatamente 3 letras."
        )

        String sigla,

        @DecimalMin(value = "0.00", message = "O caixa não pode ser negativo.")
        @Digits(
                integer = 8,
                fraction = 2,
                message = "O caixa deve ter no máximo 2 casas decimais."
        )

        BigDecimal caixa,

        @Size(max = 5, message = "A formação deve ter no máximo 5 caracteres.")
        String formacao
) {
}
