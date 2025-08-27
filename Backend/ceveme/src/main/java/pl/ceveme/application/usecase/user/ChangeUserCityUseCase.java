package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.UpdateUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.PhoneNumber;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class ChangeUserCityUseCase {

    private final UserRepository userRepository;

    public ChangeUserCityUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UpdateUserResponse execute(Long userId, String newCity) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        if(user.getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        user.setCity(newCity);
        return new UpdateUserResponse("User city changed successfully", newCity);
    }
}
