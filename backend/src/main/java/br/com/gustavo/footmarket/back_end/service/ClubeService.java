package br.com.gustavo.footmarket.back_end.service;

import br.com.gustavo.footmarket.back_end.dto.request.ClubeRequest;
import br.com.gustavo.footmarket.back_end.dto.response.ClubeResponse;
import br.com.gustavo.footmarket.back_end.entity.Clube;
import br.com.gustavo.footmarket.back_end.repository.ClubeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
public class ClubeService {

    private ClubeRepository clubeRepository;

    public ClubeService(ClubeRepository clubeRepository) {

        this.clubeRepository = clubeRepository;
    }

    @Transactional
    public ClubeResponse criar (ClubeRequest request) {

        String nome = normalizarEspacos(request.nome());
        String nomeNormalizado = normalizarNome(nome);
        String sigla = request.sigla().trim().toUpperCase(Locale.ROOT);

        validarNome(nome);
        validarDuplicidade(nomeNormalizado, sigla, null);

        Clube clube = new Clube();
        clube.setNome(nome);
        clube.setNomeNormalizado(nomeNormalizado);
        clube.setSigla(sigla);
        clube.setCaixa(

                request.caixa() != null ? request.caixa() : new BigDecimal("300,00")
        );

        clube.setFormacao(normalizarFormacao(request.formacao()));

        return paraResponse(clubeRepository.save(clube));
    }

    @Transactional(readOnly = true)
    public List<ClubeResponse> listarTodos() {

        return clubeRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClubeResponse buscarPorId(Integer id) {

        return paraResponse(buscarEntidade(id));
    }

    @Transactional
    public ClubeResponse atualizar(Integer id, ClubeRequest request) {

        Clube clube = buscarEntidade(id);

        String nome = normalizarEspacos(request.nome());
        String nomeNormalizado = normalizarNome(nome);
        String sigla = request.sigla().trim().toUpperCase(Locale.ROOT);

        validarNome(nome);
        validarDuplicidade(nomeNormalizado, sigla, id);

        clube.setNome(nome);
        clube.setNomeNormalizado(nomeNormalizado);
        clube.setSigla(sigla);

        if (request.caixa() != null) {
            clube.setCaixa(request.caixa());
        }

        clube.setFormacao(normalizarFormacao(request.formacao()));

        return paraResponse(clubeRepository.save(clube));
    }

    @Transactional
    public void excluir(Integer id) {

        Clube clube = buscarEntidade(id);
        clubeRepository.delete(clube);
        clubeRepository.flush();
    }

    private Clube buscarEntidade(Integer id) {

        return clubeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Clube não encontrado: " + id
                ));
    }

    private void validarDuplicidade(

            String nomeNormalizado,
            String sigla,
            Integer id
    ) {

        boolean nomeExiste = id == null
                ? clubeRepository.existsByNomeNormalizado(nomeNormalizado)
                : clubeRepository.existsByNomeNormalizadoAndIdNot(nomeNormalizado, id);

        if (nomeExiste) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um clube com esse nome."
            );
        }
    }



    private void  validarNome(String nome) {

        if (nome.length() > 60) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nome deve ter 60 caracteres após a normalização"
            );
        }
    }

    private String normalizarNome(String nome) {

        return nome.toUpperCase(Locale.ROOT);
    }

    private String normalizarEspacos(String valor) {

        return valor.trim().replaceAll("\\s+", " ");
    }

    private String normalizarFormacao(String formacao) {

        if (formacao == null || formacao.isEmpty()) {

            return null;
        }

        return formacao.trim();
    }

    private ClubeResponse paraResponse(Clube clube) {

        return new ClubeResponse(

                clube.getId(),
                clube.getNome(),
                clube.getSigla(),
                clube.getCaixa(),
                clube.getFormacao(),
                clube.getCriadoEm()
        );
    }
}
