package pl.ceveme.domain.services.applicationHistory;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryRequest;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryResponse;
import pl.ceveme.domain.model.entities.ApplicationHistory;
import pl.ceveme.domain.model.entities.Cv;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.ApplicationHistoryRepository;
import pl.ceveme.domain.repositories.CvRepository;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;

@Service
public class ApplicationHistoryService {

    private final UserRepository userRepository;
    private final ApplicationHistoryRepository applicationHistoryRepository;
    private final JobOfferRepository jobOfferRepository;
    private final CvRepository cvRepository;

    public ApplicationHistoryService(UserRepository userRepository, ApplicationHistoryRepository applicationHistoryRepository, JobOfferRepository jobOfferRepository, CvRepository cvRepository) {
        this.userRepository = userRepository;
        this.applicationHistoryRepository = applicationHistoryRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.cvRepository = cvRepository;
    }

    @Transactional
    public ApplicationHistoryResponse saveApplication(ApplicationHistoryRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        JobOffer jobOffer = jobOfferRepository.findById(request.idJobOffer())
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));

        Cv cv = cvRepository.findById(request.cvId())
                .orElseThrow(() -> new IllegalArgumentException("Cv not found"));

        ApplicationHistory applicationHistory = new ApplicationHistory(LocalDate.now(), jobOffer);

        user.getApplicationHistoryList().add(applicationHistory);

        applicationHistory.setCv(cv);
        applicationHistory.setUser(user);

        userRepository.save(user);


        return new ApplicationHistoryResponse(jobOffer.getId(), "Application save successfully!");

    }
}
