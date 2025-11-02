package pl.ceveme.application.dto.email;

import java.time.Instant;

public record EmailResponse(String recipient, String message, Instant nextEmailTime) {

}
