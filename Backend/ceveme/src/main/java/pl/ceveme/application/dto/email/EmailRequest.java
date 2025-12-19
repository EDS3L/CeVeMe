package pl.ceveme.application.dto.email;

public record EmailRequest(String toEmail, String subject, String body) {
}
