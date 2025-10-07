package pl.ceveme.infrastructure.external.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) { super(message);}
}
