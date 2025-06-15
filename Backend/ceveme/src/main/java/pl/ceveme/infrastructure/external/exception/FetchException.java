package pl.ceveme.infrastructure.external.exception;

public class FetchException extends RuntimeException {
    public FetchException(String msg)                     { super(msg); }
    public FetchException(String msg, Throwable cause)    { super(msg, cause); }
}
