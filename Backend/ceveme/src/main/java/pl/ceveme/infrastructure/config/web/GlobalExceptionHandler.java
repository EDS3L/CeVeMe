package pl.ceveme.infrastructure.config.web;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import pl.ceveme.application.dto.exception.ApiError;
import pl.ceveme.infrastructure.external.exception.EmailException;
import pl.ceveme.infrastructure.external.exception.TimeoutException;

import java.io.IOException;
import java.time.Instant;

@RestControllerAdvice
@Hidden
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ApiError> handleIOException(IOException ex, HttpServletRequest request) {
        logger.error("IOException occurred: {}", ex.getMessage());
        ApiError error = new ApiError("IO_ERROR", "An input/output error occurred while processing the request.", Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TimeoutException.class)
    public ResponseEntity<ApiError> handleTimeoutException(TimeoutException ex, HttpServletRequest request) {
        logger.error("TimeoutException: {}", ex.getMessage());
        ApiError error = new ApiError("TIMEOUT_EXCEPTION", ex.getMessage(), Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        logger.warn("Illegal argument: {}", ex.getMessage());
        ApiError error = new ApiError("ILLEGAL_ARGUMENT", ex.getMessage(), Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> handleNoResourceFoundException(NoResourceFoundException ex, HttpServletRequest request) {
        logger.error("No resource found exception: {}", ex.getMessage());
        ApiError error = new ApiError("NO_RESOURCE_FOUND", "Resource not found", Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, HttpServletRequest request) {
        logger.warn("Malformed JSON request: {}", ex.getMessage());
        ex.getMostSpecificCause();
        String problem = ex.getMostSpecificCause()
                        .getMessage();
        ApiError error = new ApiError("MALFORMED_JSON", problem, Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiError> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
        logger.error("Media Type Not Supported: {}", ex.getMessage());
        ApiError error = new ApiError("UNSUPPORTED_MEDIA_TYPE", ex.getMessage(), Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @ExceptionHandler(HttpClientErrorException.Forbidden.class)
    public ResponseEntity<ApiError> handleForbidden(HttpClientErrorException.Forbidden ex, HttpServletRequest request) {
        logger.warn("Access denied: {}", ex.getMessage());
        ApiError error = new ApiError("ACCESS_DENIED", ex.getMessage(), Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(EmailException.class)
    public ResponseEntity<ApiError> handleGenericException(EmailException ex, HttpServletRequest request) {
        logger.error("Unexpected error: {}", ex.getMessage(), ex);
        ApiError error = new ApiError("EMAIL_EXCEPTION", ex.getMessage(), Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex, HttpServletRequest request) {
        logger.error("Unexpected error: {}", ex.getMessage(), ex);
        ApiError error = new ApiError("UNEXPECTED_ERROR", "An unexpected error occurred", Instant.now(), request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
