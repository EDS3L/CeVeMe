package pl.ceveme.infrastructure.external.email;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.email.EmailRequest;
import pl.ceveme.application.dto.email.EmailResponse;

import java.time.Instant;

@Service
public class ConfirmationRegisterEmail {

    private final EmailSenderService emailSenderService;

    public ConfirmationRegisterEmail(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }

    public void send(String confirmationCode, String email) {
        String SUBJECT = "CeVeMe: potwierdź adres e-mail";

        EmailRequest request = new EmailRequest(email, SUBJECT, EmailTemplates.verificationEmailHtml(confirmationCode));
        emailSenderService.sendEmail(request);

    }
}
