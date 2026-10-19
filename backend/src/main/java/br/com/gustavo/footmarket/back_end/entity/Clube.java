package br.com.gustavo.footmarket.back_end.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "clubes",
        uniqueConstraints = {

                @UniqueConstraint(

                        name = "uq_clubes_nome_normalizado",
                        columnNames = "nome_normalizado"
                ),

                @UniqueConstraint(

                        name = "uq_clubes_sigla",
                        columnNames = "sigla"
                )
        }
)

public class Clube {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome", nullable = false, length = 60)
    private String nome;

    @Column(
            name = "nome_normalizado",
            nullable = false,
            length = 60,
            columnDefinition =  "VARCHAR(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin"

    )

    private String nomeNormalizado;

    @Column(name = "sigla", nullable = false, length = 3)
    private String sigla;

    @Column(
            name = "caixa",
            nullable = false,
            precision = 10,
            scale = 2
    )

    private BigDecimal caixa = new BigDecimal("300.00");

    @Column(name = "formacao", length = 5)
    private String formacao;

    @Column(

            name = "criado_em",
            nullable = false,
            insertable = false,
            updatable = false
    )

    private LocalDateTime criadoEm;

    public Clube() {

    }

    public Integer getId() {

        return id;
    }

    public String getNome() {

        return nome;
    }

    public void setNome(String nome) {

        this.nome = nome;
    }

    public String getNomeNormalizado() {

        return nomeNormalizado;
    }

    public void setNomeNormalizado(String nomeNormalizado) {

        this.nomeNormalizado = nomeNormalizado;
    }

    public String getSigla() {

        return sigla;
    }

    public void setSigla(String sigla) {

        this.sigla = sigla;
    }

    public BigDecimal getCaixa() {

        return caixa;
    }

    public void setCaixa(BigDecimal caixa) {

        this.caixa = caixa;
    }

    public String getFormacao() {

        return formacao;
    }

    public void setFormacao(String formacao) {

        this.formacao = formacao;
    }

    public LocalDateTime getCriadoEm() {

        return criadoEm;
    }
}
