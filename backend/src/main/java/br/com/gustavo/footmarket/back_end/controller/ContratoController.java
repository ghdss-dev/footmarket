package br.com.gustavo.footmarket.back_end.controller;

import br.com.gustavo.footmarket.back_end.dto.request.ContratoRequest;
import br.com.gustavo.footmarket.back_end.dto.response.ContratoResponse;
import br.com.gustavo.footmarket.back_end.service.ContratoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contracts")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {

        this.contratoService = contratoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContratoResponse criar(@Valid @RequestBody ContratoRequest contratoRequest) {

        return contratoService.criar(contratoRequest);
    }


    @GetMapping
    public List<ContratoResponse> listar() {

        return contratoService.listar();
    }

    @GetMapping("/{id}")
    public ContratoResponse buscarPorId(@PathVariable Integer id) {

        return contratoService.buscarPorId(id);
    }

    @GetMapping("/player/{jogadorId}/active")
    public ContratoResponse buscarPorJogadorId(@PathVariable Integer jogadorId) {

        return contratoService.buscarAtivoPorJogador(jogadorId);
    }


    @PutMapping("/{id}")
    public ContratoResponse atualizar(

            @PathVariable Integer id,
            @Valid @RequestBody ContratoRequest contratoRequest
    ) {

        return contratoService.atualizar(id, contratoRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Integer id) {

        contratoService.excluir(id);
    }


}
