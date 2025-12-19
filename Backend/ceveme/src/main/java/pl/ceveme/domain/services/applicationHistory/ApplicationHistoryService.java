package pl.ceveme.domain.services.applicationHistory;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.applicationHistories.ApplicationStatusCounts;
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

    private static final Logger log = LoggerFactory.getLogger(ApplicationHistoryService.class);
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

        ApplicationHistory applicationHistory = new ApplicationHistory(jobOffer, LocalDate.now(), user, cv, ApplicationHistory.STATUS.PENDING);

        user.getApplicationHistoryList()
                .add(applicationHistory);

        applicationHistory.setCv(cv);
        applicationHistory.setUser(user);

        applicationHistoryRepository.save(applicationHistory);
        userRepository.save(user);


        return new ApplicationHistoryResponse(jobOffer.getId(), "Application save successfully!");

    }


    @Transactional
    public ApplicationStatusCounts statusCounts(Long userID) {
        int pendingCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.PENDING, userID);
        int submittedCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.SUBMITTED, userID);
        int rejectedCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.REJECTED, userID);
        int requestedCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.REQUESTED, userID);
        int screeningCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.SCREENING, userID);
        int interviewCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.INTERVIEW, userID);
        int assignmentCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.ASSIGNMENT, userID);
        int offeredCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.OFFERED, userID);
        int acceptedCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.ACCEPTED, userID);
        int declinedCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.DECLINED, userID);
        int closedCount = applicationHistoryRepository.statusByCount(ApplicationHistory.STATUS.CLOSED, userID);
        int total = applicationHistoryRepository.statusCount(userID);

        return new ApplicationStatusCounts(pendingCount, submittedCount, rejectedCount, requestedCount, screeningCount, interviewCount, assignmentCount, offeredCount, acceptedCount, declinedCount, closedCount, total);
    }
}
