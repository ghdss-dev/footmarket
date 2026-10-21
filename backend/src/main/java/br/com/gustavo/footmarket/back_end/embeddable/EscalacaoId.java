package br.com.gustavo.footmarket.back_end.embeddable;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class EscalacaoId implements Serializable {

    private Integer clubeId;
    private Integer jogadorId;

    public EscalacaoId() {

    }

    public EscalacaoId(Integer clubeId, Integer jogadorId) {

        this.clubeId = clubeId;
        this.jogadorId = jogadorId;
    }

    public Integer getClubeId() {

        return clubeId;
    }

    public Integer getJogadorId() {

        return jogadorId;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {

            return true;
        }

        if (!(o instanceof EscalacaoId that)) {

            return false;
        }

        return Objects.equals(clubeId, that.clubeId)
                && Objects.equals(jogadorId, that.jogadorId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(clubeId, jogadorId);
    }
}
