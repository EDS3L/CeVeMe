package pl.ceveme.application.usecase.user;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.UserDetailsResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class GetUserDetailsInfoUseCase {

    private final UserRepository userRepository;

    public GetUserDetailsInfoUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetailsResponse execute(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new UserDetailsResponse(user.getName().name(),user.getSurname().surname(),user.getPhoneNumber().phoneNumber(),user.getEmail().email(),user.getCity(),user.getImage());
    }
}
