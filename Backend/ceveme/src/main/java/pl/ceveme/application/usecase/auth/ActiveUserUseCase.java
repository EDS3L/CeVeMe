package pl.ceveme.application.usecase.auth;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.auth.ActiveUserRequest;
import pl.ceveme.application.dto.auth.ActiveUserResponse;
import pl.ceveme.domain.model.entities.ActivationToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.ActivationTokenRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class ActiveUserUseCase {

    private final ActivationTokenRepository activationTokenRepository;
    private final UserRepository userRepository;

    public ActiveUserUseCase(ActivationTokenRepository activationTokenRepository, UserRepository userRepository) {
        this.activationTokenRepository = activationTokenRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ActiveUserResponse execute(ActiveUserRequest request) {
        ActivationToken activationToken = activationTokenRepository.findByUuid(request.uuid())
                .orElseThrow(() -> new IllegalArgumentException("Activation Token not found"));
        User user = activationToken.getUser();

        if (activationToken.isExpired()) throw new IllegalArgumentException("Token is expired!");

        user.setActive(true);
        userRepository.save(user);

        return new ActiveUserResponse(user.getEmail()
                .email(), "User activation successful");
    }

}
