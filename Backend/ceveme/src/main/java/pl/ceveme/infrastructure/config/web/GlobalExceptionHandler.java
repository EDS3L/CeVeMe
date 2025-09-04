package pl.ceveme.infrastructure.config.web;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.ServletException;
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

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.time.Instant;

@RestControllerAdvice
@Hidden
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ApiError> handleIOException(IOException ex, HttpServletRequest request) {
        logger.error("IOException occurred: {}", ex.getMessage());
        ApiError error = new ApiError(
                "IO_ERROR",
                "An input/output error occurred while processing the request.",
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }



    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        logger.warn("Illegal argument: {}", ex.getMessage());
        ApiError error = new ApiError(
                "ILLEGAL_ARGUMENT",
                ex.getMessage(),
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> handleNoResourceFoundException(Exception ex, HttpServletRequest request) {
        logger.error(" No resource found exception: {}", ex.getMessage(), ex);
        ApiError error = new ApiError(
                "No Resource_Found",
                "An no resource found exception" ,
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleHttpMessageNotReadableException(HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
        logger.warn("Malformed JSON request: {}", ex.getMessage());
        String problem = ex.getMessage();
        ApiError error = new ApiError(
                "MALFORMED_JSON",
                problem,
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpClientErrorException.Forbidden.class)
    public ResponseEntity<ApiError> handleHttpMessageAccessDeniedException(HttpClientErrorException.Forbidden ex, HttpServletRequest request) {
        logger.warn("Access denied exception: {}", ex.getMessage());
        String problem = ex.getMessage();
        ApiError error = new ApiError(
                "Access denied exception",
                problem,
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiError> handleHttpMediaTypeNotSupportedException(HttpMessageNotReadableException ex , HttpServletRequest request) {
        logger.error(" Media Type Not Supported ");
        Throwable rootCause = ex.getMostSpecificCause();
        String problem = rootCause.getMessage();
        ApiError error = new ApiError(
                "HttpMediaTypeNotSupportedException",
                "Media type not supported",
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(HttpMessageNotReadableException ex, HttpServletRequest request) {
        logger.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        ApiError error = new ApiError(
                "UNEXPECTED_ERROR",
                "An unexpected error occurred",
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiError> handleAccessDeniedException(Exception ex, HttpServletRequest request) {
//        logger.error("An unexpected error occurred: {}", ex.getMessage(), ex);
//        ApiError error = new ApiError(
//                "FORBIDDEN",
//                "An forbidden error",
//                Instant.now(),
//                request.getRequestURI()
//        );
//        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
//    }
}
