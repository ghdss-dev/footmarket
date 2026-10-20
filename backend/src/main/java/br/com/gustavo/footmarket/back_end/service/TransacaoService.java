package br.com.gustavo.footmarket.back_end.service;

import br.com.gustavo.footmarket.back_end.dto.request.TransacaoRequest;
import br.com.gustavo.footmarket.back_end.dto.response.TransacaoResponse;
import br.com.gustavo.footmarket.back_end.entity.Clube;
import br.com.gustavo.footmarket.back_end.entity.Jogador;
import br.com.gustavo.footmarket.back_end.entity.Transacao;
import br.com.gustavo.footmarket.back_end.repository.ClubeRepository;
import br.com.gustavo.footmarket.back_end.repository.JogadorRepository;
import br.com.gustavo.footmarket.back_end.repository.TransacaoRepository;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class TransacaoService {

    // Todas as datas ficam no horario de Brasilia (RN01)
    private static final ZoneId BRASILIA = ZoneId.of("America/Sao_Paulo");

    private final TransacaoRepository transacaoRepository;
    private final ClubeRepository clubeRepository;
    private final JogadorRepository jogadorRepository;

    public TransacaoService(
            TransacaoRepository transacaoRepository,
            ClubeRepository clubeRepository,
            JogadorRepository jogadorRepository
    ) {

        this.transacaoRepository = transacaoRepository;
        this.clubeRepository = clubeRepository;
        this.jogadorRepository = jogadorRepository;
    }

    @Transactional
    public TransacaoResponse criarParaTeste(TransacaoRequest transacaoRequest) {

        Clube clube = clubeRepository.findById(transacaoRequest.jogadorId())
                .orElseThrow(() -> new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Clube não encontrado."
                ));

        Jogador jogador = jogadorRepository.findByIdAndExcluidoEmIsNull(transacaoRequest.jogadorId())
                .orElseThrow(() -> new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Jogador não encontrado."
                ));

        LocalDateTime agora = LocalDateTime.now();

        if (Transacao.COMPRA.equals(transacaoRequest.tipo())) {

            return registrarCompra(jogador, clube, transacaoRequest.valor(), transacaoRequest.taxa(), agora);

        }

        if (transacaoRequest.lucro() == null) {

            throw new ResponseStatusException(

                    HttpStatus.BAD_REQUEST,
                    "O lucro é obrigatório em uma venda"
            );
        }

        BigDecimal multa = transacaoRequest.multa() == null
                ? BigDecimal.ZERO.setScale(2) : transacaoRequest.multa();

        return registrarVenda(

                jogador,
                clube,
                transacaoRequest.valor(),
                transacaoRequest.taxa(),
                multa,
                transacaoRequest.lucro(),
                agora
        );
    }

    public TransacaoResponse registrarVenda(

            Jogador jogador,
            Clube clube,
            BigDecimal valor,
            BigDecimal comissao,
            BigDecimal multa,
            BigDecimal lucro,
            LocalDateTime momento
    ) {

        Transacao transacao = new Transacao();
        transacao.setClube(clube);
        transacao.setJogador(jogador);
        transacao.setNomeJogador(jogador.getNome());
        transacao.setTipo(Transacao.VENDA);
        transacao.setValor(valor);
        transacao.setTaxa(comissao);
        transacao.setMulta(multa);
        transacao.setLucro(lucro);
        transacao.setVariacaoCaixa(valor.subtract(multa).subtract(comissao));
        transacao.setCriadoEm(momento);

        return paraResponse(transacaoRepository.save(transacao));

    }

    /**
     * Grava a transação COMPRA (RN17). Os Valores já chegam calculados e arredondados.
     * Mandatory: so roda dentro da transacao da compra, junto com o desconto da caixa
     * e a criação do contrato. Chamar fora dela de erro, de proposito.
     *
     * variação da caixa = -(valor - taxa)
     */

    @Transactional(propagation = Propagation.MANDATORY)
    public TransacaoResponse registrarCompra(

            Jogador jogador,
            Clube clube,
            BigDecimal valor,
            BigDecimal taxa,
            LocalDateTime momento
    ) {

        Transacao transacao = new Transacao();
        transacao.setClube(clube);
        transacao.setJogador(jogador);
        transacao.setNomeJogador(jogador.getNome());
        transacao.setTipo(Transacao.COMPRA);
        transacao.setValor(valor);
        transacao.setTaxa(taxa);
        transacao.setMulta(BigDecimal.ZERO.setScale(2));
        transacao.setLucro(null);
        transacao.setVariacaoCaixa(valor.add(taxa).negate());
        transacao.setCriadoEm(momento);

        return paraResponse(transacaoRepository.save(transacao));
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponse> listar(Integer clubeId) {

        List<Transacao> transacoes;

        if (clubeId == null) {

            transacoes = transacaoRepository.findAllByOrderByCriadoEmDescIdDesc();

        } else {

            if (!clubeRepository.existsById(clubeId)) {

                throw new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Clube não encontrado"
                );
            }

            transacoes = transacaoRepository.findByClubeIdOrderByCriadoEmDescIdDesc(clubeId);
        }

       return transacoes.stream()
               .map(this::paraResponse)
               .toList();
    }

    @Transactional(readOnly = true)
    public TransacaoResponse buscarPorId(Long id) {

        Transacao transacao = transacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Transação não encontrado"
                ));

        return paraResponse(transacao);
    }

    private TransacaoResponse paraResponse(Transacao transacao) {

        return new TransacaoResponse(

                transacao.getId(),
                transacao.getClube().getId(),
                transacao.getJogador().getId(),
                transacao.getNomeJogador(),
                transacao.getTipo(),
                transacao.getValor(),
                transacao.getTaxa(),
                transacao.getMulta(),
                transacao.getLucro(),
                transacao.getVariacaoCaixa(),
                transacao.getCriadoEm()

        );
    }

}
