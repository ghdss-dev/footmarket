package br.com.gustavo.footmarket.back_end.controller;

import br.com.gustavo.footmarket.back_end.dto.request.PartidasRequest;
import br.com.gustavo.footmarket.back_end.dto.response.PartidasResponse;
import br.com.gustavo.footmarket.back_end.service.PartidasService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

// Imports estáticos corretos do Mockito e Spring MockMvc
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PartidasController.class) // Aponta para a classe do Controller real
public class PartidasControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean // Utilizado para simular o serviço dentro do contexto WebMvc
    private PartidasService partidasService;

    @Test
    @DisplayName("POST /api/v1/matches - Deve retornar 201 Created ao simular partida válida")
    void deveRetornar201AoJogarPartidaValida() throws Exception {

        PartidasRequest request = new PartidasRequest(1, 2);

        PartidasResponse response = new PartidasResponse(
                10,
                "2026-10-22T15:00:00-03:00",
                new PartidasResponse.TimeResponse(1, "Clube A", "2-2", 2),
                new PartidasResponse.TimeResponse(2, "Clube B", "3-1", 1),
                "MANDANTE",
                null
        );

        when(partidasService.jogar(any(PartidasRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/matches")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.result").value("MANDANTE"));
    }

    @Test
    @DisplayName("POST /api/v1/matches - Deve retornar 400 Bad Request se mandante e visitante forem o mesmo clube")
    void deveRetornar400QuandoClubesForemIguais() throws Exception {

        PartidasRequest request = new PartidasRequest(1, 1);

        when(partidasService.jogar(any(PartidasRequest.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "O clube mandante e o visitante devem ser diferentes."));

        mockMvc.perform(post("/api/v1/matches")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("O clube mandante e o visitante devem ser diferentes."));
    }

    @Test
    @DisplayName("GET /api/v1/matches/{id} - Deve retornar 404 Not Found para ID inexistente")
    void deveRetornar404ParaPartidaInexistente() throws Exception {

        when(partidasService.buscarPorId(999))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Partida não encontrada."));

        mockMvc.perform(get("/api/v1/matches/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Partida não encontrada."));
    }
}