package br.com.gustavo.footmarket.back_end.controller;

import br.com.gustavo.footmarket.back_end.dto.request.PartidasRequest;
import br.com.gustavo.footmarket.back_end.dto.response.ClassificacaoResponse;
import br.com.gustavo.footmarket.back_end.dto.response.PartidasResponse;
import br.com.gustavo.footmarket.back_end.service.PartidasService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;

/**
 * Liga: partidas e classificação, nos caminhos do enunciado (base /api/v1).
 * POST /matches, GET /matches, GET /matches/{id} e GET /standings.
 */
@RestController
@RequestMapping("/api/v1")
public class PartidasController {

    private final PartidasService partidaService;

    public PartidasController(PartidasService partidaService) {

        this.partidaService = partidaService;
    }

    @PostMapping("/matches")
    public ResponseEntity<PartidasResponse> jogar(@Valid @RequestBody PartidasRequest partidasRequest) {

        PartidasResponse response = partidaService.jogar(partidasRequest);

        return ResponseEntity
                .created(URI.create("/api/v1/matches/" + response.id()))
                .body(response);
    }

    @GetMapping("/matches")
    public List<PartidasResponse> listar(@RequestParam(name = "club_id", required = false) String clubId) {

        Integer filtro = clubId == null ? null : inteiroDaConsulta("club_id", clubId);

        return partidaService.listar(filtro);
    }

    @GetMapping("/matches/{id}")
    public PartidasResponse buscarPorId(@PathVariable String id) {

        return partidaService.buscarPorId(idDaUrl(id));
    }

    @GetMapping("/standings")
    public List<ClassificacaoResponse> classificacao() {

        return partidaService.classificacao();
    }

    // V8: id da URL que não é inteiro positivo só com dígitos, sem zeros à esquerda, conta como inexistente (404).
    private Integer idDaUrl(String id) {

        if (!id.matches("[1-9][0-9]*")) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Partida não encontrada.");
        }

        try {

            return Integer.parseInt(id);

        } catch (NumberFormatException e) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Partida não encontrada.");
        }
    }

    // Query param inteiro: só positivo, escrito só com dígitos; vazio ou fora do formato é 400.
    private Integer inteiroDaConsulta(String nome, String valor) {

        if (!valor.matches("[1-9][0-9]*")) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O parâmetro '" + nome + "' deve ser um inteiro positivo."
            );
        }

        try {

            return Integer.parseInt(valor);

        } catch (NumberFormatException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O parâmetro '" + nome + "' está fora do intervalo permitido."
            );
        }
    }
}
