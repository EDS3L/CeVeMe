package pl.ceveme.application.usecase.applicationHistory;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.applicationHistories.ApplicationHistoriesResponse;
import pl.ceveme.domain.model.entities.ApplicationHistory;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class GetApplicationHistoriesUseCase {

    private final UserRepository userRepository;

    public GetApplicationHistoriesUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public List<ApplicationHistoriesResponse> execute(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return user.getApplicationHistoryList().stream().map(ah -> new ApplicationHistoriesResponse(
                ah.getId(),
                ah.getJobOffer().getId(),
                ah.getJobOffer().getCompany(),
                ah.getJobOffer().getLink(),
                ah.getApplicationDate(),
                LocalDate.now(),
                ah.getCv().getCvImage(),
                ah.getStatus(),
                ah.getJobOffer().getTitle()
        )).toList();

    }
}
