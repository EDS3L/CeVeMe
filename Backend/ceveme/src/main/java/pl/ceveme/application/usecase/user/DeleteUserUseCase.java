package pl.ceveme.application.usecase.user;


import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.user.DeleteUserRequest;
import pl.ceveme.application.dto.user.DeleteUserResponse;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class DeleteUserUseCase {

    private final UserRepository userRepository;

    public DeleteUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public DeleteUserResponse execute(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User with id: " + id + " does not exist");
        }

        userRepository.deleteById(id);

        return new DeleteUserResponse("User with id: " + id + " has been deleted");
    }
}
