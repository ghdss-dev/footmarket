package br.com.gustavo.footmarket.back_end.service;

import br.com.gustavo.footmarket.back_end.dto.request.ContratoRequest;
import br.com.gustavo.footmarket.back_end.dto.response.ContratoResponse;
import br.com.gustavo.footmarket.back_end.entity.Clube;
import br.com.gustavo.footmarket.back_end.entity.Contrato;
import br.com.gustavo.footmarket.back_end.entity.Jogador;
import br.com.gustavo.footmarket.back_end.repository.ClubeRepository;
import br.com.gustavo.footmarket.back_end.repository.ContratoRepository;
import br.com.gustavo.footmarket.back_end.repository.JogadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class ContratoService {

    private static final ZoneId BRASILIA = ZoneId.of("America/Sao_Paulo");
    private static final long LIMITE_FIDELIDADE_DIAS = 1095;

    private ContratoRepository contratoRepository;
    private JogadorRepository jogadorRepository;
    private ClubeRepository clubeRepository;

    public ContratoService(

            ContratoRepository contratoRepository,
            JogadorRepository jogadorRepository,
            ClubeRepository clubeRepository
    ) {

        this.contratoRepository = contratoRepository;
        this.jogadorRepository = jogadorRepository;
        this.clubeRepository = clubeRepository;
    }

    @Transactional
    public ContratoResponse criar(ContratoRequest request) {

        LocalDateTime agora = LocalDateTime.now(BRASILIA);

        Jogador jogador = jogadorRepository.findByIdAndExcluidoEmIsNull(request.jogadorId())
                .orElseThrow(() -> new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Jogador não encotrado."
                ));

        Clube clube = clubeRepository.findById(request.clubeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Clube não encontrado."
                ));

        if (contratoRepository.existsByJogadorIdAndSituacao(jogador.getId(), Contrato.ATIVO)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O jogador já possui um contrato ativo."
            );
        }

        Contrato contrato = new Contrato();
        contrato.setJogador(jogador);
        contrato.setClube(clube);
        contrato.setValorCompra(request.valorCompra());
        contrato.setFidelidadeAte(request.fidelidadeAte());
        contrato.setSituacao(Contrato.ATIVO);
        contrato.setIniciadoEm(agora);

        return paraResponse(contratoRepository.save(contrato));
    }

    @Transactional(readOnly = true)
    public List<ContratoResponse> listar() {

        return contratoRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContratoResponse buscarPorId(Integer id) {

        Contrato contrato = contratoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Contrato não encontrado."
                ));

        return paraResponse(contrato);
    }

    @Transactional(readOnly = true)
    public ContratoResponse buscarAtivoPorJogador(Integer jogadorId) {

        return paraResponse(buscarAtivo(jogadorId));
    }

    @Transactional
    public ContratoResponse encerrar(Integer jogadorId, boolean comMulta, LocalDateTime momento) {

        Contrato contrato = buscarAtivo(jogadorId);
        contrato.setSituacao(comMulta ? Contrato.RESCINDIDO : Contrato.ENCERRADO);
        contrato.setEncerradoEm(momento);

        return paraResponse(contratoRepository.save(contrato));
    }

    private Contrato buscarAtivo(Integer jogadorId) {

        return contratoRepository.findByJogadorIdAndSituacao(jogadorId, Contrato.ATIVO)
                .orElseThrow(() -> new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Contrato ativo não encontrado para o jogador"
                ));
    }

    private void validarFidelidade(LocalDateTime fidelidade, LocalDateTime agora) {

        if (!fidelidade.isAfter(agora)) {

            throw new ResponseStatusException(

                    HttpStatus.BAD_REQUEST,
                    "O fim da fidelidade deve ser depois do momento da compra."
            );
        }

        if (fidelidade.isAfter(agora.plusDays(LIMITE_FIDELIDADE_DIAS))) {

            throw new ResponseStatusException(

                    HttpStatus.BAD_REQUEST,
                    "O fim da fidelidade pode ser no máximo " + LIMITE_FIDELIDADE_DIAS + "dias depois da compra."
            );
        }
    }

    private ContratoResponse paraResponse(Contrato contrato) {

        Jogador jogador = contrato.getJogador();
        Clube clube = contrato.getClube();

        return new ContratoResponse(

                contrato.getId(),
                jogador.getId(),
                jogador.getNome(),
                clube.getId(),
                clube.getNome(),
                contrato.getValorCompra(),
                contrato.getFidelidadeAte(),
                contrato.getSituacao(),
                contrato.getIniciadoEm(),
                contrato.getEncerradoEm()
        );
    }

    @Transactional
    public ContratoResponse atualizar(Integer id, ContratoRequest request) {

        validarFidelidade(request.fidelidadeAte(), LocalDateTime.now(BRASILIA));

        Contrato contrato = buscarContrato(id);

        if (!Contrato.ATIVO.equals(contrato.getSituacao())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Só é possível alterar um contrato ativo."
            );
        }

        boolean mesmoJogador = contrato.getJogador().getId().equals(request.jogadorId());
        boolean mesmoClube = contrato.getClube().getId().equals(request.clubeId());

        if (!mesmoJogador || !mesmoClube) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível trocar o jogador ou o clube de um contrato."
            );
        }

        contrato.setValorCompra(request.valorCompra());
        contrato.setFidelidadeAte(request.fidelidadeAte());

        return paraResponse(contratoRepository.save(contrato));
    }

    /**
     * Apaga somente contrato ATIVO. O historico (ENCERRADO e RESCINDIDO)
     * nunca e apagado, porque contratos antigos ficam como foram gravados.
     */
    @Transactional
    public void excluir(Integer id) {

        Contrato contrato = buscarContrato(id);

        if (!Contrato.ATIVO.equals(contrato.getSituacao())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O histórico de contratos encerrados ou rescindidos não pode ser apagado."
            );
        }

        contratoRepository.delete(contrato);
    }

    private Contrato buscarContrato(Integer id) {

        return contratoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Contrato não encontrado."
                ));
    }


}
