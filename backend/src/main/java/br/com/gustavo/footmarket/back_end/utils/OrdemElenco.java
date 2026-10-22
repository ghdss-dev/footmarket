package br.com.gustavo.footmarket.back_end.utils;

import br.com.gustavo.footmarket.back_end.entity.Jogador;

import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

public final class OrdemElenco {

    private static final List<String> POSICOES = List.of("GOL", "ZAG", "MEI", "ATA");

    private OrdemElenco() {}

    public static Comparator<Jogador> comparator() {

        return Comparator
                .comparingInt((Jogador jogador) -> POSICOES.indexOf(jogador.getPosicao()))
                .thenComparing(jogador -> normalizar(jogador.getNome()))
                .thenComparing(Jogador::getId);
    }

    public static String normalizar(String texto) {

        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{Mn}", "");

        return semAcento.toLowerCase(Locale.ROOT);
    }
}
