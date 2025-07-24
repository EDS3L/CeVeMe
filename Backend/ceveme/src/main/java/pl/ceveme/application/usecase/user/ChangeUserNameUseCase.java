package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.UpdateUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Name;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class ChangeUserNameUseCase {

    private final UserRepository userRepository;

    public ChangeUserNameUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UpdateUserResponse execute(Long userId, String newName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        user.changeName(new Name(newName));

        return new UpdateUserResponse("User name changed successfully", newName);
    }
}