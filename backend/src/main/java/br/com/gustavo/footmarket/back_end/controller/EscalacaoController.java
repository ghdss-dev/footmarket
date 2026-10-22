package br.com.gustavo.footmarket.back_end.controller;

import br.com.gustavo.footmarket.back_end.dto.request.EscalacaoRequest;
import br.com.gustavo.footmarket.back_end.dto.response.EscalacaoResponse;
import br.com.gustavo.footmarket.back_end.service.EscalacaoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clubs/{clubeId}/lineup")
public class EscalacaoController {

    private final EscalacaoService escalacaoService;

    public EscalacaoController(EscalacaoService escalacaoService) {

        this.escalacaoService = escalacaoService;
    }

    @PutMapping
    public EscalacaoResponse escalar( @PathVariable Integer clubeId, @Valid @RequestBody EscalacaoRequest escalacaoRequest) {

        try {
            return escalacaoService.escalar(clubeId, escalacaoRequest);

        } catch (Throwable e) {

            throw new RuntimeException(e);
        }
    }

    @GetMapping
    public EscalacaoResponse obter(@PathVariable Integer clubeId) {

        return escalacaoService.obter(clubeId);
    }
}
