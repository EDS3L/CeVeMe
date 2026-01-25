package pl.ceveme.application.usecase.interview;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.InterviewSessionRepository;

@Service
public class AbandonSessionUseCase {

    private final InterviewSessionRepository sessionRepository;

    public AbandonSessionUseCase(InterviewSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Transactional
    public void execute(Long sessionId, User user) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        if (!session.isInProgress()) {
            throw new IllegalArgumentException("Session is not in progress");
        }

        session.abandon();
        sessionRepository.save(session);
    }
}
