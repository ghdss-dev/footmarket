package br.com.gustavo.footmarket.back_end.service;

import br.com.gustavo.footmarket.back_end.dto.request.PartidasRequest;
import br.com.gustavo.footmarket.back_end.dto.response.ClassificacaoResponse;
import br.com.gustavo.footmarket.back_end.dto.response.PartidasResponse;
import br.com.gustavo.footmarket.back_end.entity.*;
import br.com.gustavo.footmarket.back_end.repository.ClubeRepository;
import br.com.gustavo.footmarket.back_end.repository.DuelosPartidasRepository;
import br.com.gustavo.footmarket.back_end.repository.EscalacaoRepository;
import br.com.gustavo.footmarket.back_end.repository.PartidasRepository;
import br.com.gustavo.footmarket.back_end.utils.OrdemElenco;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PartidasService {

    private static final ZoneId BRASILIA = ZoneId.of("America/Sao_Paulo");
    private static final BigDecimal FATOR_MAL_CONDICIONADO = new BigDecimal("0.85");
    private static final int TITULARES = 5;
    // RN01: respostas no formato AAAA-MM-DDTHH:MM:SS-03:00 (horário de Brasília, sem horário de verão)
    private static final ZoneOffset OFFSET_BRASILIA = ZoneOffset.ofHours(-3);
    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssxxx");

    private final PartidasRepository partidaRepository;
    private final DuelosPartidasRepository duelosPartidasRepository;
    private final ClubeRepository clubeRepository;
    private final EscalacaoRepository escalacaoRepository;

    public PartidasService(


            PartidasRepository partidaRepository,
            DuelosPartidasRepository duelosPartidasRepository,
            ClubeRepository clubeRepository,
            EscalacaoRepository escalacaoRepository
    ) {

        this.partidaRepository = partidaRepository;
        this.duelosPartidasRepository = duelosPartidasRepository;
        this.clubeRepository = clubeRepository;
        this.escalacaoRepository = escalacaoRepository;
    }

    /*
      Joga a partida na hora e grava tudo numa unica operação (RN20).
      Sem sorteio: os mesmos titulares, nas mesmas condicoes, dão sempre o mesmo placar.
      Ordem das recusas: 400 (clubes iguais), 404 (clube não existe), 409 (escalação incompleta).
      A partida não muda caixa, escalação nem jogadores.
     */

    @Transactional
    public PartidasResponse jogar(PartidasRequest partidasRequest) {

        if (partidasRequest.homeClubId().equals(partidasRequest.awayClubId())) {

            throw new ResponseStatusException(

                    HttpStatus.BAD_REQUEST,
                    "O clube mandante e o visitante devem ser diferentes."
            );
        }

        Clube mandante = clubeRepository.findById(partidasRequest.homeClubId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Clube mandante não encontrado."
                ));

        Clube visitante = clubeRepository.findById(partidasRequest.awayClubId())
                .orElseThrow(() -> new ResponseStatusException(

                        HttpStatus.NOT_FOUND,
                        "Clube visitante não encontrado."
                ));

        List<Jogador> timeMandante = titulares(mandante);
        List<Jogador> timeVisitante = titulares(visitante);

        List<DuelosPartidas> duelosMandante = ataques(1, mandante, timeMandante, timeVisitante);
        List<DuelosPartidas> duelosVisitante = ataques(4, visitante, timeVisitante, timeMandante);

        Partidas partidas = new Partidas();
        partidas.setMandante(mandante);
        partidas.setVisitante(visitante);
        partidas.setGolsMandante(contarGols(duelosMandante));
        partidas.setGolsVisitante(contarGols(duelosVisitante));
        partidas.setFormacaoMandante(mandante.getFormacao());
        partidas.setFormacaoVisitante(visitante.getFormacao());
        partidas.setJogadaEm(LocalDateTime.now(BRASILIA));

        Partidas salva = partidaRepository.save(partidas);

        List<DuelosPartidas> duelos = new ArrayList<>();
        duelos.addAll(duelosMandante);
        duelos.addAll(duelosVisitante);
        duelos.forEach(duelo -> duelo.setPartida(salva));

        duelosPartidasRepository.saveAll(duelos);

        return paraResponse(salva, duelos);
    }

    @Transactional(readOnly = true)
    public List<PartidasResponse> listar(Integer clubeId) {

        List<Partidas> partidas;

        if (clubeId == null) {

            partidas = partidaRepository.listarRecentes();

        } else {

            if (!clubeRepository.existsById(clubeId)) {

                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Clube não encontrado."
                );
            }

            partidas = partidaRepository.listarDoClube(clubeId);
        }

        return partidas.stream()
                .map(partida -> paraResponse(partida, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public PartidasResponse buscarPorId(Integer id) {

        Partidas partida = partidaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Partida não encontrada."
                ));

        List<DuelosPartidas> duelos = duelosPartidasRepository.findByPartidaIdOrderByOrdemAsc(id);

        return paraResponse(partida, duelos);
    }

    /**
     * Os 5 titulares na ordem do elenco (RN11): o goleiro e depois os 4 jogadores
     * de linha, do 1o (mais recuado) ao 4o (mais avancado).
     * Indices da lista: 0 = goleiro, 1 = 1o de linha, 2 = 2o, 3 = 3o, 4 = 4o.
     */
    private List<Jogador> titulares(Clube clube) {

        List<Jogador> jogadores = escalacaoRepository.findByClubeId(clube.getId())
                .stream()
                .map(Escalacao::getJogador)
                .sorted(OrdemElenco.comparator())
                .toList();

        boolean completa = clube.getFormacao() != null
                && jogadores.size() == TITULARES
                && "GOL".equals(jogadores.get(0).getPosicao())
                && jogadores.stream().filter(j -> "GOL".equals(j.getPosicao())).count() == 1
                && jogadores.stream().noneMatch(j -> "DOENTE".equals(j.getCondicao()));

        if (!completa) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O clube " + clube.getNome() + " não tem escalação completa."
            );
        }

        return jogadores;
    }

    /**
     * Os 3 ataques de um time (tabela "Quem ataca e quem defende"):
     * 4o de linha x goleiro, 3o de linha x 1o de linha, 2o de linha x 2o de linha.
     */
    private List<DuelosPartidas> ataques(

            int primeiraOrdem,
            Clube clubeAtacante,
            List<Jogador> atacantes,
            List<Jogador> defensores
    ) {

        List<DuelosPartidas> duelos = new ArrayList<>();

        duelos.add(criarDuelo(primeiraOrdem, clubeAtacante, atacantes.get(4), defensores.get(0)));
        duelos.add(criarDuelo(primeiraOrdem + 1, clubeAtacante, atacantes.get(3), defensores.get(1)));
        duelos.add(criarDuelo(primeiraOrdem + 2, clubeAtacante, atacantes.get(2), defensores.get(2)));

        return duelos;
    }

    private DuelosPartidas criarDuelo(int ordem, Clube clubeAtacante, Jogador atacante, Jogador defensor) {

        // ATA usa finalizacao, MEI usa passe, ZAG e LAT usam drible. O defensor usa sempre a defesa.
        String atributoAtaque;
        int valorBruto;

        if ("ATA".equals(atacante.getPosicao())) {

            atributoAtaque = "shooting";
            valorBruto = atacante.getFinalizacao();

        } else if ("MEI".equals(atacante.getPosicao())) {

            atributoAtaque = "passing";
            valorBruto = atacante.getPasse();

        } else {

            atributoAtaque = "dribbling";
            valorBruto = atacante.getDrible();
        }

        int valorAtaque = aplicarCondicao(valorBruto, atacante.getCondicao());
        int valorDefesa = aplicarCondicao(defensor.getDefesa(), defensor.getCondicao());

        DuelosPartidas duelo = new DuelosPartidas();
        duelo.setOrdem(ordem);
        duelo.setClubeAtacante(clubeAtacante);
        duelo.setAtacante(atacante);
        duelo.setDefensor(defensor);
        duelo.setNomeAtacante(atacante.getNome());
        duelo.setNomeDefensor(defensor.getNome());
        duelo.setPosicaoAtacante(atacante.getPosicao());
        duelo.setPosicaoDefensor(defensor.getPosicao());
        duelo.setCondicaoAtacante(atacante.getCondicao());
        duelo.setCondicaoDefensor(defensor.getCondicao());
        duelo.setAtributoAtaque(atributoAtaque);
        duelo.setAtributoDefesa("defending");
        duelo.setValorAtaque(valorAtaque);
        duelo.setValorDefesa(valorDefesa);

        // E gol quando o ataque e maior que a defesa; empate nao e gol.
        duelo.setGol(valorAtaque > valorDefesa);

        return duelo;
    }

    // MAL_CONDICIONADO joga com 15% a menos, arredondado para o inteiro mais proximo,
    // com o meio para cima: 74 x 0,85 = 62,9 -> 63; 50 x 0,85 = 42,5 -> 43.
    private int aplicarCondicao(int valor, String condicao) {

        if (!"MAL_CONDICIONADO".equals(condicao)) {

            return valor;
        }

        return BigDecimal.valueOf(valor)
                .multiply(FATOR_MAL_CONDICIONADO)
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();
    }

    private int contarGols(List<DuelosPartidas> duelos) {

        return (int) duelos.stream()
                .filter(duelo -> Boolean.TRUE.equals(duelo.getGol()))
                .count();
    }

    /**
     * Classificação de todos os clubes, inclusive os que ainda não jogaram (RN21).
     * Calculada a cada consulta, nunca gravada. Vitória 3 pontos, empate 1, derrota 0.
     * Ordem: pontos, saldo de gols, gols marcados, nome do clube (sem acento e caixa) e id.
     */
    @Transactional(readOnly = true)
    public List<ClassificacaoResponse> classificacao() {

        Map<Integer, LinhaDaTabela> tabela = new LinkedHashMap<>();

        for (Clube clube : clubeRepository.findAll()) {

            tabela.put(clube.getId(), new LinhaDaTabela(clube));
        }

        for (Partidas partida : partidaRepository.listarRecentes()) {

            int golsMandante = partida.getGolsMandante();
            int golsVisitante = partida.getGolsVisitante();

            tabela.get(partida.getMandante().getId()).registrar(golsMandante, golsVisitante);
            tabela.get(partida.getVisitante().getId()).registrar(golsVisitante, golsMandante);
        }

        List<LinhaDaTabela> ordenada = tabela.values().stream()
                .sorted(Comparator
                        .comparingInt(LinhaDaTabela::pontos).reversed()
                        .thenComparing(Comparator.comparingInt(LinhaDaTabela::saldo).reversed())
                        .thenComparing(Comparator.comparingInt((LinhaDaTabela l) -> l.golsPro).reversed())
                        .thenComparing(l -> OrdemElenco.normalizar(l.clube.getNome()))
                        .thenComparing(l -> l.clube.getId()))
                .toList();

        List<ClassificacaoResponse> resposta = new ArrayList<>();

        for (int i = 0; i < ordenada.size(); i++) {

            LinhaDaTabela l = ordenada.get(i);

            resposta.add(new ClassificacaoResponse(
                    i + 1, l.clube.getId(), l.clube.getNome(), l.jogos, l.vitorias, l.empates, l.derrotas,
                    l.golsPro, l.golsContra, l.saldo(), l.pontos()));
        }

        return resposta;
    }

    /** Acumula o desempenho de um clube na tabela. */
    private static final class LinhaDaTabela {

        private final Clube clube;
        private int jogos;
        private int vitorias;
        private int empates;
        private int derrotas;
        private int golsPro;
        private int golsContra;

        private LinhaDaTabela(Clube clube) {

            this.clube = clube;
        }

        private void registrar(int golsMarcados, int golsSofridos) {

            jogos++;
            golsPro += golsMarcados;
            golsContra += golsSofridos;

            if (golsMarcados > golsSofridos) {
                vitorias++;
            } else if (golsMarcados == golsSofridos) {
                empates++;
            } else {
                derrotas++;
            }
        }

        private int pontos() {

            return vitorias * 3 + empates;
        }

        private int saldo() {

            return golsPro - golsContra;
        }
    }

    private String resultado(int golsMandante, int golsVisitante) {

        if (golsMandante > golsVisitante) {

            return "MANDANTE";
        }

        if (golsVisitante > golsMandante) {

            return "VISITANTE";
        }

        return "EMPATE";
    }

    private PartidasResponse paraResponse(Partidas partida, List<DuelosPartidas> duelos) {

        Clube mandante = partida.getMandante();
        Clube visitante = partida.getVisitante();

        List<PartidasResponse.DueloResponse> duelosResponse = duelos == null
                ? null
                : duelos.stream().map(this::paraDuelo).toList();

        return new PartidasResponse(

                partida.getId(),
                partida.getJogadaEm().atOffset(OFFSET_BRASILIA).format(FORMATO_DATA),
                new PartidasResponse.TimeResponse(
                        mandante.getId(),
                        mandante.getNome(),
                        partida.getFormacaoMandante(),
                        partida.getGolsMandante()
                ),
                new PartidasResponse.TimeResponse(
                        visitante.getId(),
                        visitante.getNome(),
                        partida.getFormacaoVisitante(),
                        partida.getGolsVisitante()
                ),
                resultado(partida.getGolsMandante(), partida.getGolsVisitante()),
                duelosResponse
        );
    }

    private PartidasResponse.DueloResponse paraDuelo(DuelosPartidas duelo) {

        return new PartidasResponse.DueloResponse(

                duelo.getOrdem(),
                duelo.getClubeAtacante().getId(),
                new PartidasResponse.ParticipanteResponse(
                        duelo.getAtacante().getId(),
                        duelo.getNomeAtacante(),
                        duelo.getPosicaoAtacante(),
                        duelo.getCondicaoAtacante(),
                        duelo.getAtributoAtaque(),
                        duelo.getValorAtaque()
                ),
                new PartidasResponse.ParticipanteResponse(
                        duelo.getDefensor().getId(),
                        duelo.getNomeDefensor(),
                        duelo.getPosicaoDefensor(),
                        duelo.getCondicaoDefensor(),
                        duelo.getAtributoDefesa(),
                        duelo.getValorDefesa()
                ),
                duelo.getGol()
        );
    }
}
