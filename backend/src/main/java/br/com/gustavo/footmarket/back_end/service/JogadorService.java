package br.com.gustavo.footmarket.back_end.service;

import br.com.gustavo.footmarket.back_end.dto.request.JogadorRequest;
import br.com.gustavo.footmarket.back_end.dto.response.JogadorResponse;
import br.com.gustavo.footmarket.back_end.entity.Clube;
import br.com.gustavo.footmarket.back_end.entity.Jogador;
import br.com.gustavo.footmarket.back_end.repository.ClubeRepository;
import br.com.gustavo.footmarket.back_end.repository.JogadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JogadorService {

    private JogadorRepository jogadorRepository;
    private ClubeRepository clubeRepository;

    public JogadorService(

            JogadorRepository jogadorRepository,
            ClubeRepository clubeRepository
    ) {

        this.jogadorRepository = jogadorRepository;
        this.clubeRepository = clubeRepository;
    }

    @Transactional
    public JogadorResponse criar(JogadorRequest request) {

        Jogador jogador = new Jogador();
        preencher(jogador, request);

        return paraResponse(jogadorRepository.save(jogador));
    }

    @Transactional(readOnly = true)
    public List<JogadorResponse> listar() {

        return jogadorRepository.findByExcluidoEmIsNull()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public JogadorResponse buscarPorId(Integer id) {

        return paraResponse(buscarAtivo(id));
    }

    @Transactional
    public JogadorResponse atualizar(Integer id, JogadorRequest request) {

        Jogador jogador = buscarAtivo(id);
        preencher(jogador, request);

        return paraResponse(jogadorRepository.save(jogador));
    }

    @Transactional
    public void excluir(Integer id) {

        Jogador jogador = buscarAtivo(id);
        jogador.setExcluidoEm(LocalDateTime.now());
        jogadorRepository.save(jogador);
    }

    private Jogador buscarAtivo(Integer id) {

        return jogadorRepository.findByIdAndExcluidoEmIsNull(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Jogador não encontrado."
                ));
    }

    private void preencher(Jogador jogador, JogadorRequest request) {

        jogador.setNome(request.nome().trim());
        jogador.setPosicao(request.posicao());
        jogador.setAgilidade(request.agilidade());
        jogador.setIdade(request.idade());
        jogador.setValorBase(request.valorBase());

        jogador.setCondicao(request.condicao().isBlank() ? "APTO" : request.condicao());

        jogador.setVelocidade(request.velocidade());
        jogador.setFinalizacao(request.finalizado());
        jogador.setPasse(request.passe());
        jogador.setDrible(request.drible());
        jogador.setDefesa(request.defesa());
        jogador.setFisico(request.fisico());
        jogador.setPotencial(request.potencial());

        if (request.clubeId() == null) {

            jogador.setClube(null);

        } else {

            Clube clube = clubeRepository.findById(request.clubeId())
                    .orElseThrow(() -> new ResponseStatusException(

                            HttpStatus.BAD_REQUEST,
                            "Clube informado não existe."
                    ));
            jogador.setClube(clube);
        }
    }

    private JogadorResponse paraResponse(Jogador jogador) {

        Clube clube = jogador.getClube();

       return new JogadorResponse(

               jogador.getId(),
               jogador.getNome(),
               jogador.getPosicao(),
               jogador.getAgilidade(),
               jogador.getIdade(),
               jogador.getValorBase(),
               jogador.getCondicao(),

               clube != null ? clube.getId() : null,
               clube != null ? clube.getNome() : null,
               jogador.getVelocidade(),
               jogador.getFinalizacao(),
               jogador.getPasse(),
               jogador.getDrible(),
               jogador.getDefesa(),
               jogador.getFisico(),
               jogador.getPotencial(),
               jogador.getCriadoEm(),
               jogador.getAtualizadoEm()

       );
    }
}
