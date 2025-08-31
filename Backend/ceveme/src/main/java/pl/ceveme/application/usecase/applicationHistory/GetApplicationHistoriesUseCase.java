package pl.ceveme.application.usecase.applicationHistory;


import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.ApplicationHistory;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.List;

@Service
public class GetApplicationHistoriesUseCase {

    private final UserRepository userRepository;

    public GetApplicationHistoriesUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<ApplicationHistory> execute(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return user.getApplicationHistoryList();

    }
}
