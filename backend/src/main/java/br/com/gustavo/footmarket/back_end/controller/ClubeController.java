package br.com.gustavo.footmarket.back_end.controller;

import br.com.gustavo.footmarket.back_end.dto.request.ClubeRequest;
import br.com.gustavo.footmarket.back_end.dto.response.ClubeResponse;
import br.com.gustavo.footmarket.back_end.service.ClubeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubes")
public class ClubeController {

    private final ClubeService clubeService;

    public ClubeController(ClubeService clubeService) {

        this.clubeService = clubeService;
    }

    @PostMapping
    public ResponseEntity<ClubeResponse> criar(@Valid @RequestBody ClubeRequest clubeRequest) {

        ClubeResponse response = clubeService.criar(clubeRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ClubeResponse>> listarTodos() {

        return ResponseEntity.ok(clubeService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubeResponse> buscarPorId( @PathVariable Integer id) {

        return ResponseEntity.ok(clubeService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClubeResponse> atualizar(@PathVariable Integer id, @Valid @RequestBody ClubeRequest clubeRequest) {

        return ResponseEntity.ok(clubeService.atualizar(id,clubeRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {

        clubeService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
