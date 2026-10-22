package br.com.gustavo.footmarket.back_end.service;

import br.com.gustavo.footmarket.back_end.dto.request.ContratoRequest;
import br.com.gustavo.footmarket.back_end.dto.response.ContratoResponse;
import br.com.gustavo.footmarket.back_end.entity.Clube;
import br.com.gustavo.footmarket.back_end.entity.Contrato;
import br.com.gustavo.footmarket.back_end.entity.Jogador;
import br.com.gustavo.footmarket.back_end.repository.ClubeRepository;
import br.com.gustavo.footmarket.back_end.repository.ContratoRepository;
import br.com.gustavo.footmarket.back_end.repository.JogadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContratoServiceTest {

    @Mock
    private ContratoRepository contratoRepository;

    @Mock
    private JogadorRepository jogadorRepository;

    @Mock
    private ClubeRepository clubeRepository;

    @InjectMocks
    private ContratoService contratoService;

    private Jogador jogadorMock;
    private Clube clubeMock;

    @BeforeEach
    void setUp() {
        jogadorMock = new Jogador();
        ReflectionTestUtils.setField(jogadorMock, "id", 1); // Atribui ID via Reflection
        jogadorMock.setNome("Neymar Jr");

        clubeMock = new Clube();
        ReflectionTestUtils.setField(clubeMock, "id", 1); // Atribui ID via Reflection
        clubeMock.setNome("Santos");
    }

    @Test
    @DisplayName("Deve criar contrato com sucesso quando dados forem válidos")
    void deveCriarContratoComSucesso() {
        LocalDateTime fidelidadeValida = LocalDateTime.now().plusDays(30);
        ContratoRequest request = new ContratoRequest(1, 1, new BigDecimal("1000.00"), fidelidadeValida);

        when(jogadorRepository.findByIdAndExcluidoEmIsNull(1)).thenReturn(Optional.of(jogadorMock));
        when(clubeRepository.findById(1)).thenReturn(Optional.of(clubeMock));
        when(contratoRepository.existsByJogadorIdAndSituacao(1, Contrato.ATIVO)).thenReturn(false);

        Contrato contratoSalvo = new Contrato();
        ReflectionTestUtils.setField(contratoSalvo, "id", 10);
        contratoSalvo.setJogador(jogadorMock);
        contratoSalvo.setClube(clubeMock);
        contratoSalvo.setValorCompra(request.valorCompra());
        contratoSalvo.setFidelidadeAte(fidelidadeValida);
        contratoSalvo.setSituacao(Contrato.ATIVO);
        contratoSalvo.setIniciadoEm(LocalDateTime.now());

        when(contratoRepository.save(any(Contrato.class))).thenReturn(contratoSalvo);

        ContratoResponse response = contratoService.criar(request);

        assertNotNull(response);
        assertEquals("Neymar Jr", response.nomeJogador());
        assertEquals("Santos", response.nomeClube());
        verify(contratoRepository, times(1)).save(any(Contrato.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar contrato para jogador que já possui contrato ativo")
    void deveLancarExcecaoQuandoJogadorJaPossuiContratoAtivo() {
        LocalDateTime fidelidadeValida = LocalDateTime.now().plusDays(30);
        ContratoRequest request = new ContratoRequest(1, 1, new BigDecimal("1000.00"), fidelidadeValida);

        when(jogadorRepository.findByIdAndExcluidoEmIsNull(1)).thenReturn(Optional.of(jogadorMock));
        when(clubeRepository.findById(1)).thenReturn(Optional.of(clubeMock));
        when(contratoRepository.existsByJogadorIdAndSituacao(1, Contrato.ATIVO)).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            contratoService.criar(request);
        });

        assertNotNull(exception.getReason());
        assertTrue(exception.getReason().contains("O jogador já possui um contrato ativo"));
        verify(contratoRepository, never()).save(any());
    }
}