package br.com.gustavo.footmarket.back_end.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.Map;

/**
 * Toda recusa devolve um objeto JSON com o campo "message" (sem stack trace) e o status certo:
 * 400 dado inválido, 404 recurso inexistente, 409 regra de negócio, 500 falha inesperada.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> statusExplicito(ResponseStatusException e) {

        String mensagem = e.getReason() != null ? e.getReason() : "Requisição recusada.";

        return resposta(e.getStatusCode(), mensagem);
    }

    // Erros de validação do @Valid (campo ausente, nulo, id zero ou negativo...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> corpoInvalido(MethodArgumentNotValidException e) {

        String mensagem = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(erro -> erro.getDefaultMessage())
                .orElse("Dados inválidos.");

        return resposta(HttpStatus.BAD_REQUEST, mensagem);
    }

    // JSON malformado, corpo que não é objeto ou tipo errado (ex.: texto onde se espera número)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> corpoIlegivel(HttpMessageNotReadableException e) {

        return resposta(HttpStatus.BAD_REQUEST, "O corpo da requisição deve ser um objeto JSON válido.");
    }

    // Id inválido na URL conta como inexistente (404); em query param é dado inválido (400)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> tipoIncorreto(MethodArgumentTypeMismatchException e) {

        if (e.getParameter().hasParameterAnnotation(PathVariable.class)) {

            return resposta(HttpStatus.NOT_FOUND, "Recurso não encontrado.");
        }

        return resposta(HttpStatus.BAD_REQUEST, "O parâmetro '" + e.getName() + "' é inválido.");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, String>> caminhoInexistente(NoResourceFoundException e) {

        return resposta(HttpStatus.NOT_FOUND, "Recurso não encontrado.");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, String>> metodoNaoPrevisto(HttpRequestMethodNotSupportedException e) {

        return resposta(HttpStatus.METHOD_NOT_ALLOWED, "Método não permitido para este caminho.");
    }

    // Restrição do banco violada (ex.: nome ou sigla duplicados numa corrida entre duas requisições)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> integridade(DataIntegrityViolationException e) {

        return resposta(HttpStatus.CONFLICT, "A operação viola uma regra de integridade dos dados.");
    }

    // Falha inesperada: registra no log e devolve mensagem genérica. Se o erro veio embrulhado
    // (como no EscalacaoController, que relança Throwable como RuntimeException), devolve o status original.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> inesperado(Exception e, HttpServletRequest requisicao) {

        Throwable causa = e;

        while (causa != null && !(causa instanceof ResponseStatusException)) {

            causa = causa.getCause();
        }

        if (causa != null) {

            return statusExplicito((ResponseStatusException) causa);
        }

        LOG.error("Erro inesperado em {} {}", requisicao.getMethod(), requisicao.getRequestURI(), e);

        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno. Tente novamente mais tarde.");
    }

    private ResponseEntity<Map<String, String>> resposta(HttpStatusCode status, String mensagem) {

        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("message", mensagem));
    }
}
