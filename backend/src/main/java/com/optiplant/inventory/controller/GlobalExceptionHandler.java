package com.optiplant.inventory.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

/**
 * ¿Por qué se hizo así?
 *   • Centraliza el manejo de errores para que los controladores permanezcan limpios.
 *   • Captura los principales tipos de excepción que pueden lanzar los servicios
 *     (validación, integridad de BD, argumentos no válidos) y devuelve respuestas JSON
 *     consistentes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "Datos no válidos",
                "details", ex.getBindingResult().toString()
        ));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleIntegrity(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "error", "Violación de integridad",
                "details", ex.getRootCause().getMessage()
        ));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<?> handleBind(BindException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "Error de enlace",
                "details", ex.getBindingResult().toString()
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleOther(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Error interno",
                "details", ex.getMessage()
        ));
    }
}
