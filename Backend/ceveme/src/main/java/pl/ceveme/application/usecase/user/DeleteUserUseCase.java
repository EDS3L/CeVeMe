package pl.ceveme.application.usecase.user;


import jakarta.transaction.Transactional;
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
    public DeleteUserResponse execute(DeleteUserRequest request) {
        if (!userRepository.existsById(request.id())) {
            throw new IllegalArgumentException("User with id: " + request.id() + " does not exist");
        }

        userRepository.deleteById(request.id());

        return new DeleteUserResponse("User with id: " + request.id() + " has been deleted");
    }
}
