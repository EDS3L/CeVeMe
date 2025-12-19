package pl.ceveme.application.usecase.email;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.email.EmailResponse;
import pl.ceveme.domain.model.entities.ActivationToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.ActivationTokenRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.external.email.ConfirmationRegisterEmail;
import pl.ceveme.infrastructure.external.exception.EmailException;
import pl.ceveme.infrastructure.external.exception.UserNotFoundException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class SendConfirmationCodeAgainUseCase {

    private final UserRepository userRepository;
    private final ConfirmationRegisterEmail confirmationRegisterEmail;
    private final ActivationTokenRepository activationTokenRepository;

    private final String randomUUID = UUID.randomUUID() + "";
    private final LocalDate activeTokenExpired = LocalDate.now().plusWeeks(2);

    public SendConfirmationCodeAgainUseCase(UserRepository userRepository, ConfirmationRegisterEmail confirmationRegisterEmail, ActivationTokenRepository activationTokenRepository) {
        this.userRepository = userRepository;
        this.confirmationRegisterEmail = confirmationRegisterEmail;
        this.activationTokenRepository = activationTokenRepository;
    }

    public EmailResponse send(Email email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found!"));

        if(user.getActivationToken() == null) throw new EmailException("Wystąpił bląd, spróbuj zalogować się jeszcze raz!");

        ActivationToken currentActiveToken = user.getActivationToken();

        currentActiveToken.setUuid(randomUUID);
        currentActiveToken.setExpirationDate(activeTokenExpired);
        activationTokenRepository.save(currentActiveToken);

        confirmationRegisterEmail.send(currentActiveToken.getUuid(), email.email());

        return new EmailResponse(email.email(), "Kod wysłany prawidłowo!", Instant.now().plusSeconds(30));

    }
}
