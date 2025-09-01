package pl.ceveme.domain.services.applicationHistory;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryRequest;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryResponse;
import pl.ceveme.domain.model.entities.ApplicationHistory;
import pl.ceveme.domain.model.entities.Cv;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.ApplicationHistoryRepository;
import pl.ceveme.domain.repositories.CvRepository;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;

@Service
public class ApplicationHistoryService {

    private final UserRepository userRepository;
    private final JobOfferRepository jobOfferRepository;
    private final CvRepository cvRepository;
    private final ApplicationHistoryRepository applicationHistoryRepository;

    public ApplicationHistoryService(UserRepository userRepository, JobOfferRepository jobOfferRepository, CvRepository cvRepository, ApplicationHistoryRepository applicationHistoryRepository) {
        this.userRepository = userRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.cvRepository = cvRepository;
        this.applicationHistoryRepository = applicationHistoryRepository;
    }

    @Transactional
    public ApplicationHistoryResponse saveApplication(ApplicationHistoryRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        JobOffer jobOffer = jobOfferRepository.findByLink(request.link())
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));

        Cv cv = cvRepository.findById(request.cvId())
                .orElseThrow(() -> new IllegalArgumentException("Cv not found"));

        ApplicationHistory applicationHistory = new ApplicationHistory(jobOffer,LocalDate.now(),user,cv, ApplicationHistory.STATUS.PENDING);

        user.getApplicationHistoryList().add(applicationHistory);

        applicationHistory.setCv(cv);
        applicationHistory.setUser(user);

        applicationHistoryRepository.save(applicationHistory);
        userRepository.save(user);


        return new ApplicationHistoryResponse(jobOffer.getId(), "Application save successfully!");

    }
}
