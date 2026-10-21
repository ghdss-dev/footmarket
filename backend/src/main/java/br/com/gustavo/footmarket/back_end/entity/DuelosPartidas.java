package br.com.gustavo.footmarket.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "duelos_partida")
public class DuelosPartidas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "partida_id", nullable = false)
    private Partidas partida;

    // De 1 a 6: os 3 ataques do mandante e depois os 3 do visitante (RN20).
    @Column(name = "ordem", nullable = false)
    private Integer ordem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "clube_atacante_id", nullable = false)
    private Clube clubeAtacante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atacante_id", nullable = false)
    private Jogador atacante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "defensor_id", nullable = false)
    private Jogador defensor;

    // Nomes, posições e condições da partida: nunca são recalculados.
    @Column(name = "nome_atacante", nullable = false, length = 100)
    private String nomeAtacante;

    @Column(name = "nome_defensor", nullable = false, length = 100)
    private String nomeDefensor;

    @Column(name = "posicao_atacante", nullable = false, length = 3)
    private String posicaoAtacante;

    @Column(name = "posicao_defensor", nullable = false, length = 3)
    private String posicaoDefensor;

    @Column(name = "condicao_atacante", nullable = false, length = 20)
    private String condicaoAtacante;

    @Column(name = "condicao_defensor", nullable = false, length = 20)
    private String condicaoDefensor;

    // shooting, passing, dribbling ou defending.
    @Column(name = "atributo_ataque", nullable = false, length = 10)
    private String atributoAtaque;

    @Column(name = "atributo_defesa", nullable = false, length = 10)
    private String atributoDefesa;

    // Valores já com o efeito da condicao (Mal_Condicionado joga com 15% a menos)
    @Column(name = "valor_ataque", nullable = false)
    private Integer valorAtaque;

    @Column(name = "valor_defesa", nullable = false)
    private Integer valorDefesa;

    @Column(name = "gol", nullable = false)
    private Boolean gol;

    public DuelosPartidas() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Partidas getPartida() {
        return partida;
    }

    public void setPartida(Partidas partida) {
        this.partida = partida;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public void setOrdem(Integer ordem) {
        this.ordem = ordem;
    }

    public Clube getClubeAtacante() {
        return clubeAtacante;
    }

    public void setClubeAtacante(Clube clubeAtacante) {
        this.clubeAtacante = clubeAtacante;
    }

    public Jogador getAtacante() {
        return atacante;
    }

    public void setAtacante(Jogador atacante) {
        this.atacante = atacante;
    }

    public Jogador getDefensor() {
        return defensor;
    }

    public void setDefensor(Jogador defensor) {
        this.defensor = defensor;
    }

    public String getNomeAtacante() {
        return nomeAtacante;
    }

    public void setNomeAtacante(String nomeAtacante) {
        this.nomeAtacante = nomeAtacante;
    }

    public String getNomeDefensor() {
        return nomeDefensor;
    }

    public void setNomeDefensor(String nomeDefensor) {
        this.nomeDefensor = nomeDefensor;
    }

    public String getPosicaoAtacante() {
        return posicaoAtacante;
    }

    public void setPosicaoAtacante(String posicaoAtacante) {
        this.posicaoAtacante = posicaoAtacante;
    }

    public String getPosicaoDefensor() {
        return posicaoDefensor;
    }

    public void setPosicaoDefensor(String posicaoDefensor) {
        this.posicaoDefensor = posicaoDefensor;
    }

    public String getCondicaoAtacante() {
        return condicaoAtacante;
    }

    public void setCondicaoAtacante(String condicaoAtacante) {
        this.condicaoAtacante = condicaoAtacante;
    }

    public String getCondicaoDefensor() {
        return condicaoDefensor;
    }

    public void setCondicaoDefensor(String condicaoDefensor) {
        this.condicaoDefensor = condicaoDefensor;
    }

    public String getAtributoAtaque() {
        return atributoAtaque;
    }

    public void setAtributoAtaque(String atributoAtaque) {
        this.atributoAtaque = atributoAtaque;
    }

    public String getAtributoDefesa() {
        return atributoDefesa;
    }

    public void setAtributoDefesa(String atributoDefesa) {
        this.atributoDefesa = atributoDefesa;
    }

    public Integer getValorAtaque() {
        return valorAtaque;
    }

    public void setValorAtaque(Integer valorAtaque) {
        this.valorAtaque = valorAtaque;
    }

    public Integer getValorDefesa() {
        return valorDefesa;
    }

    public void setValorDefesa(Integer valorDefesa) {
        this.valorDefesa = valorDefesa;
    }

    public Boolean getGol() {
        return gol;
    }

    public void setGol(Boolean gol) {
        this.gol = gol;
    }
}
