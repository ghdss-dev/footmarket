package br.com.gustavo.footmarket.back_end.entity;

import br.com.gustavo.footmarket.back_end.embeddable.EscalacaoId;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "escalacoes")
public class Escalacao {

    @EmbeddedId
    private EscalacaoId id;

    @MapsId("clubeId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "clube_id", nullable = false)
    private Clube clube;

    @MapsId("jogadorId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jogador_id", nullable = false)
    private Jogador jogador;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    public Escalacao() {

    }

    public Escalacao(Clube clube, Jogador jogador, LocalDateTime criadoEm) {

        this.id = new EscalacaoId(clube.getId(), jogador.getId());
        this.clube = clube;
        this.jogador = jogador;
        this.criadoEm = criadoEm;
    }

    public Clube getClube() {

        return clube;
    }

    public Jogador getJogador() {

        return jogador;
    }

    public LocalDateTime getCriadoEm() {

        return criadoEm;
    }


}
