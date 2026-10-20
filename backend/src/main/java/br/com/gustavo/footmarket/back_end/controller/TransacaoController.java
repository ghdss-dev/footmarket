package br.com.gustavo.footmarket.back_end.controller;

import br.com.gustavo.footmarket.back_end.dto.request.TransacaoRequest;
import br.com.gustavo.footmarket.back_end.dto.response.TransacaoResponse;
import br.com.gustavo.footmarket.back_end.service.TransacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transacoes")
public class TransacaoController {

    private TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {

        this.transacaoService = transacaoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransacaoResponse criarTransacao(@RequestBody TransacaoRequest transacaoRequest) {

        return transacaoService.criarParaTeste(transacaoRequest);
    }

    @GetMapping
    public List<TransacaoResponse> listar (@RequestParam(required = false) Integer clubeId) {

        return transacaoService.listar(clubeId);
    }

    @GetMapping("/{id}")
    public TransacaoResponse buscarPorId (@PathVariable Long id) {

        return transacaoService.buscarPorId(id);
    }
}
