package pl.ceveme.infrastructure.external.exception;


import java.time.Duration;

public class TimeoutException extends RuntimeException{
    private final Duration remaining;


    public TimeoutException(Duration remaining){
        super("Timeout is still active! Time left: " + format(remaining));
        this.remaining = remaining.isNegative() ? Duration.ZERO : remaining;
    }

    public Duration getRemaining() {
        return remaining;
    }

    private static String format(Duration d) {
        long seconds = Math.max(0, d.getSeconds());
        long minutes = seconds / 60;
        long remSec = seconds % 60;
        return String.format("%d:%02d",minutes,remSec);
    }
}
