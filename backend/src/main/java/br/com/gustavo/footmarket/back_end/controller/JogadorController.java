package br.com.gustavo.footmarket.back_end.controller;

import br.com.gustavo.footmarket.back_end.dto.request.JogadorRequest;
import br.com.gustavo.footmarket.back_end.dto.response.JogadorResponse;
import br.com.gustavo.footmarket.back_end.service.JogadorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/players")
public class JogadorController {

    private final JogadorService jogadorService;

    public JogadorController(JogadorService jogadorService) {
        this.jogadorService = jogadorService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JogadorResponse criar(@Valid @RequestBody JogadorRequest jogadorRequest) {

        return jogadorService.criar(jogadorRequest);
    }

    @GetMapping
    public List<JogadorResponse> listar() {

        return jogadorService.listar();
    }

    @GetMapping("/{id}")
    public JogadorResponse buscarPorId(@PathVariable Integer id) {

        return jogadorService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public JogadorResponse atualizar(

            @PathVariable Integer id,
            @Valid @RequestBody JogadorRequest jogadorRequest
    ) {

        return jogadorService.atualizar(id, jogadorRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Integer id) {
        jogadorService.excluir(id);
    }
}
