package pl.ceveme.application.usecase.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.UpdateUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Surname;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class ChangeUserSurnameUseCase {

    private final UserRepository userRepository;

    public ChangeUserSurnameUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UpdateUserResponse execute(Long userId, String newSurname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        user.changeSurname(new Surname(newSurname));
        return new UpdateUserResponse("User surname changed successfully", newSurname);
    }
}