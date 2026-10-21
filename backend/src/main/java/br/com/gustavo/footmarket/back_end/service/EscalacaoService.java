package br.com.gustavo.footmarket.back_end.service;

import br.com.gustavo.footmarket.back_end.dto.request.EscalacaoRequest;
import br.com.gustavo.footmarket.back_end.dto.response.EscalacaoResponse;
import br.com.gustavo.footmarket.back_end.entity.Clube;
import br.com.gustavo.footmarket.back_end.entity.Escalacao;
import br.com.gustavo.footmarket.back_end.entity.Jogador;
import br.com.gustavo.footmarket.back_end.utils.OrdemElenco;
import br.com.gustavo.footmarket.back_end.repository.ClubeRepository;
import br.com.gustavo.footmarket.back_end.repository.EscalacaoRepository;
import br.com.gustavo.footmarket.back_end.repository.JogadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class EscalacaoService {

    private static final ZoneId BRASILIA = ZoneId.of("America/Sao_Paulo");
    private static final int TITULARES  = 5;

    private final EscalacaoRepository escalacaoRepository;
    private final ClubeRepository clubeRepository;
    private final JogadorRepository jogadorRepository;

    public EscalacaoService(

            EscalacaoRepository escalacaoRepository,
            ClubeRepository clubeRepository,
            JogadorRepository jogadorRepository
    ) {

        this.escalacaoRepository = escalacaoRepository;
        this.clubeRepository = clubeRepository;
        this.jogadorRepository = jogadorRepository;
    }

    /**
     * Substitui a escalação inteira do clube numa única operação (RN19).
     * Ordem das recusas: 400 (formato), 404 (não existo), 409 (regra).
     */

    @Transactional
    public EscalacaoResponse escalar(Integer clubeId, EscalacaoRequest escalacaoRequest) throws Throwable {

        if (new HashSet<>(escalacaoRequest.jogadorIds()).size() != escalacaoRequest.jogadorIds().size()) {

            throw new ResponseStatusException(

                    HttpStatus.BAD_REQUEST,
                    "Os jogadores da escalação não podem se repetir."
            );
        }

        Clube clube = buscarClube(clubeId);

        List<Jogador> jogadores = new ArrayList<>();

        for (Integer jogadorId : escalacaoRequest.jogadorIds()) {

            Jogador jogador = jogadorRepository
                    .findByIdAndExcluidoEmIsNull(jogadorId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Jogador não encontrado."
                    ));

            jogadores.add(jogador);
        }

        for (Jogador jogador : jogadores) {

            boolean doElenco = jogador.getClube() != null && jogador.getClube().getId().equals(clube.getId());

            if (!doElenco) {

                throw new ResponseStatusException(

                        HttpStatus.CONFLICT,
                        "O jogador " + jogador.getNome() + " não está no elenco do clube."
                );
            }

            if ("DOENTE".equals(jogador.getCondicao())) {

                throw new ResponseStatusException(

                        HttpStatus.CONFLICT,
                        "O jogador " + jogador.getNome() + " está DOENTE e não pode ser escalado."
                );
            }
        }

        validarFormacao(escalacaoRequest.formacao(), jogadores);

        escalacaoRepository.apagarDoClube(clube.getId());

        clube.setFormacao(escalacaoRequest.formacao());
        clubeRepository.save(clube);

        LocalDateTime agora = LocalDateTime.now(BRASILIA);

        escalacaoRepository.saveAll(

                jogadores.stream().map(jogador -> new Escalacao(clube, jogador, agora)).toList()
        );

        return montarResposta(clube, jogadores);
    }

    @Transactional(readOnly = true)
    public EscalacaoResponse obter(Integer clubeId) {

        Clube clube = buscarClube(clubeId);

        List<Jogador> titulares = escalacaoRepository.findByClubeId(clube.getId())
                .stream()
                .map(Escalacao::getJogador)
                .toList();

        return montarResposta(clube, titulares);
    }

    /**
     * O titular sai da escalação quando é vendido ou passa a está doente (RN19)
     * quem chama e a venda é a alteração de condição, na mesma transação.
     */

    @Transactional
    public void removerTitular(Integer jogadorId) {

        escalacaoRepository.apagarDoJogador(jogadorId);

    }

    private Clube buscarClube(Integer clubeId) {

        return clubeRepository.findById(clubeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Clube não encontrado."
                ));
    }


    // 1 GOL e, em cada setor, a quantidade da formação  (o goleiro fica fora da conta).
    private void validarFormacao(String formacao, List<Jogador> jogadores) {

        long goleiros = jogadores.stream().filter(j -> "GOL".equals(j.getPosicao())).count();
        long defensores = jogadores.stream().filter(j -> "ZAG".equals(j.getPosicao()) || "LAT".equals(j.getPosicao())).count();
        long meias = jogadores.stream().filter(j -> "MEI".equals(j.getPosicao())).count();
        long atacantes = jogadores.stream().filter(j -> "ATA".equals(j.getPosicao())).count();

        int[] esperado = setores(formacao);

        boolean fecha = goleiros == 1 && defensores == esperado[0] && meias == esperado[1] && atacantes == esperado[2];

        if (!fecha) {

            throw new ResponseStatusException(

                    HttpStatus.CONFLICT,
                    "As posições dos jogadores não fecham a formação " + formacao
                            + " (1 goleiro e os jogadores de linha de cada setor)."
            );
        }
    }

    // Retorna {defesa, meio, ataque}. "3-1" tem defesa e ataque; "2-1-1" tem os três setores.
    private int[] setores(String formacao) {

        String[] partes = formacao.split("-");

        if (partes.length == 2) {

            return new int[]{Integer.parseInt(partes[0]), 0, Integer.parseInt(partes[1])};
        }

        return new int[] {

                Integer.parseInt(partes[0]),
                Integer.parseInt(partes[1]),
                Integer.parseInt(partes[2])
        };
    }

    private EscalacaoResponse montarResposta(Clube clube, List<Jogador> titulares) {

        List<EscalacaoResponse.TitularResponse> jogadores = titulares.stream()
                .sorted(OrdemElenco.comparator())
                .map(this::paraTitular)
                .toList();

        return new EscalacaoResponse(

                clube.getId(),
                clube.getFormacao(),
                jogadores.size() == TITULARES,
                jogadores
        );
    }

    private EscalacaoResponse.TitularResponse paraTitular(Jogador jogador) {

        return new EscalacaoResponse.TitularResponse(

                jogador.getId(),
                jogador.getNome(),
                jogador.getPosicao(),
                jogador.getCondicao(),
                jogador.getAgilidade(),
                jogador.getIdade(),
                jogador.getVelocidade(),
                jogador.getFinalizacao(),
                jogador.getPasse(),
                jogador.getDrible(),
                jogador.getDefesa(),
                jogador.getFisico(),
                jogador.getPotencial()
        );
    }


}