package pl.ceveme.application.usecase.applicationHistory;

import jakarta.transaction.Transactional;
import org.hibernate.FetchNotFoundException;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.applicationHistories.ApplicationHistoriesRequest;
import pl.ceveme.application.dto.applicationHistories.ApplicationHistoriesResponse;
import pl.ceveme.domain.model.entities.ApplicationHistory;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.ApplicationHistoryRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.external.exception.UserNotFoundException;

import java.nio.file.AccessDeniedException;

@Service
public class ChangeAppliactanionHistoriesStatus {

    private final UserRepository userRepository;
    private final ApplicationHistoryRepository applicationHistoryRepository;

    public ChangeAppliactanionHistoriesStatus(UserRepository userRepository, ApplicationHistoryRepository applicationHistoryRepository) {
        this.userRepository = userRepository;
        this.applicationHistoryRepository = applicationHistoryRepository;
    }

    @Transactional
    public ApplicationHistoriesResponse changeStatus(ApplicationHistoriesRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));
        ApplicationHistory applicationHistory = applicationHistoryRepository.findById(request.applicationHistoriesID()).orElseThrow(() -> new FetchNotFoundException("Application histories not found", request.applicationHistoriesID()));

        if (!user.getApplicationHistoryList().contains(applicationHistory)) {
            throw new AccessDeniedException("Access denied");
        }

        applicationHistory.changeStatus(request.status());
        applicationHistoryRepository.save(applicationHistory);
        return new ApplicationHistoriesResponse(
                request.applicationHistoriesID(),
                applicationHistory.getJobOffer().getId(),
                null,
                null,
                null,
                null,
                null,
                request.status(),
                null
        );

    }
}
