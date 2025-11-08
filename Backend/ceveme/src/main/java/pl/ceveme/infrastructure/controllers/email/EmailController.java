package pl.ceveme.infrastructure.controllers.email;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.email.EmailRequest;
import pl.ceveme.infrastructure.external.email.EmailSenderService;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailSenderService emailSenderService;

    public EmailController(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }


    @PostMapping("/send")
    public ResponseEntity<String> send(EmailRequest request) {
        emailSenderService.sendEmail(request);
        return ResponseEntity.ok("Wysłano");
    }

}
