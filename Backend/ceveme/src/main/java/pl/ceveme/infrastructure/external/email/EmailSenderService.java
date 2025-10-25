package pl.ceveme.infrastructure.external.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.email.EmailRequest;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;
    @Value("${mail.username}")
    private String username;

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(EmailRequest emailRequest) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(username);
        simpleMailMessage.setTo(emailRequest.toEmail());
        simpleMailMessage.setText(emailRequest.body());
        simpleMailMessage.setSubject(emailRequest.subject());
        mailSender.send(simpleMailMessage);
    }
}
