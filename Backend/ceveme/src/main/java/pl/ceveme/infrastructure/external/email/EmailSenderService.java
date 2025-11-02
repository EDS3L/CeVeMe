package pl.ceveme.infrastructure.external.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.email.EmailRequest;
import pl.ceveme.infrastructure.external.exception.EmailException;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;
    @Value("${mail.username}")
    private String username;

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(EmailRequest emailRequest) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    msg,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(new InternetAddress(username, "CeVeMe"));
            helper.setTo(emailRequest.toEmail());
            helper.setSubject(emailRequest.subject());

            helper.setText(emailRequest.body(),true);

            mailSender.send(msg);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new EmailException(e.getMessage());
        }
    }
}
