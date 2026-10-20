package br.com.gustavo.footmarket.back_end.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class Transacao {

    public static final String COMPRA = "COMPRA";
    public static final String VENDA = "VENDA";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "clube_id", nullable = false)
    private Clube clube;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jogador_id", nullable = false)
    private Jogador jogador;

    // Nome do Jogador no momento da operação: a transação nunca é recalculada (RN 17)
    @Column(name = "nome_jogador", nullable = false, length = 100)
    private String nomeJogador;

    @Column(name = "tipo", nullable = false, precision = 6, scale = 2)
    private String tipo;

    @Column(name = "valor", nullable = false, precision = 6, scale = 2)
    private BigDecimal valor;

    // Taxa de compra (RN13) ou comissão de venda (RN16).
    @Column(name = "taxa", nullable = false, precision = 6, scale = 2)
    private BigDecimal taxa;

    @Column(name = "multa", nullable = false, precision = 6, scale = 2)
    private BigDecimal multa;

    // Nulo na compra; na venda pode ser positivo ou negativo.
    @Column(name = "lucro", precision = 7, scale = 2)
    private BigDecimal lucro;

    @Column(name = "variacao_caixa", nullable = false, precision = 8, scale = 2)
    private BigDecimal variacaoCaixa;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    public Transacao() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Clube getClube() {
        return clube;
    }

    public void setClube(Clube clube) {
        this.clube = clube;
    }

    public Jogador getJogador() {
        return jogador;
    }

    public void setJogador(Jogador jogador) {
        this.jogador = jogador;
    }

    public String getNomeJogador() {
        return nomeJogador;
    }

    public void setNomeJogador(String nomeJogador) {
        this.nomeJogador = nomeJogador;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public BigDecimal getTaxa() {
        return taxa;
    }

    public void setTaxa(BigDecimal taxa) {
        this.taxa = taxa;
    }

    public BigDecimal getMulta() {
        return multa;
    }

    public void setMulta(BigDecimal multa) {
        this.multa = multa;
    }

    public BigDecimal getLucro() {
        return lucro;
    }

    public void setLucro(BigDecimal lucro) {
        this.lucro = lucro;
    }

    public BigDecimal getVariacaoCaixa() {
        return variacaoCaixa;
    }

    public void setVariacaoCaixa(BigDecimal variacaoCaixa) {
        this.variacaoCaixa = variacaoCaixa;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
