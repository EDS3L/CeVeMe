package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.UpdateUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.PhoneNumber;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class ChangeUserPhoneNumberUseCase {

    private final UserRepository userRepository;

    public ChangeUserPhoneNumberUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UpdateUserResponse execute(Long userId, String newPhoneNumber) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        if(user.getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        user.changePhoneNumber(new PhoneNumber(newPhoneNumber));
        return new UpdateUserResponse("User phone number changed successfully", newPhoneNumber);
    }
}