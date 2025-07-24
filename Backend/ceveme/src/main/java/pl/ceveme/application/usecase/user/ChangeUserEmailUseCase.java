package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.UpdateUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class ChangeUserEmailUseCase {

    private final UserRepository userRepository;

    public ChangeUserEmailUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UpdateUserResponse execute(Long userId, String newEmailValue) {
        Email newEmail = new Email(newEmailValue);

        userRepository.findByEmail(newEmail).ifPresent(existingUser -> {
            if (existingUser.getId() != userId) {
                throw new IllegalArgumentException("Email " + newEmailValue + " is already taken.");
            }
        });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        user.changeEmail(newEmail);
        return new UpdateUserResponse("User email changed successfully", newEmailValue);
    }
}