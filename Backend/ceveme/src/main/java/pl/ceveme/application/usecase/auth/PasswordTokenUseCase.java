package pl.ceveme.application.usecase.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.dto.auth.PasswordTokenResponse;
import pl.ceveme.application.dto.email.EmailRequest;
import pl.ceveme.domain.model.entities.PasswordToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.PasswordTokenRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.external.email.EmailSenderService;
import pl.ceveme.infrastructure.external.email.RestartPasswordEmail;
import pl.ceveme.infrastructure.external.exception.UserNotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PasswordTokenUseCase {

    private static final Logger log = LoggerFactory.getLogger(PasswordTokenUseCase.class);
    private final UserRepository userRepository;
    private final PasswordTokenRepository passwordTokenRepository;
    private final RestartPasswordEmail restartPasswordEmail;

    public PasswordTokenUseCase(UserRepository userRepository, PasswordTokenRepository passwordTokenRepository, RestartPasswordEmail restartPasswordEmail) {
        this.userRepository = userRepository;
        this.passwordTokenRepository = passwordTokenRepository;
        this.restartPasswordEmail = restartPasswordEmail;
    }

    public PasswordTokenResponse createToken(Email email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found!"));
        log.info("User password token {}", user.getPasswordToken());
        if(user.getPasswordToken() != null) {
            user.getPasswordToken().setToken(UUID.randomUUID() + "");
            passwordTokenRepository.save(user.getPasswordToken());
            restartPasswordEmail.send(user.getPasswordToken().getToken(), user.getEmail().email());
        } else {
            PasswordToken passwordToken = new PasswordToken(UUID.randomUUID() + "", LocalDateTime.now().plusMinutes(15), LocalDateTime.now());
            passwordToken.setUser(user);
            user.setPasswordToken(passwordToken);
            userRepository.save(user);
            restartPasswordEmail.send(passwordToken.getToken(), user.getEmail().email());
        }
        return new PasswordTokenResponse(user.getId(), "Password token created successfully!");

    }
}
