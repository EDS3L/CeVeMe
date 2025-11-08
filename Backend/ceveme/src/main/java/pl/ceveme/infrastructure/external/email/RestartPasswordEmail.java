package pl.ceveme.infrastructure.external.email;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.email.EmailRequest;

@Service
public class RestartPasswordEmail {

    private final EmailSenderService emailSenderService;

    public RestartPasswordEmail(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }

    public void send(String passwordToken, String email) {
        String SUBJECT = "CeVeMe: zresetuj swoje hasło";

        EmailRequest request = new EmailRequest(email, SUBJECT, EmailTemplates.passwordResetEmailHtml(passwordToken));
        emailSenderService.sendEmail(request);

    }
}
