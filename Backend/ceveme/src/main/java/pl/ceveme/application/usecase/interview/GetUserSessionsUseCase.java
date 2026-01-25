package pl.ceveme.application.usecase.interview;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.interview.SessionSummaryResponse;
import pl.ceveme.application.mapper.InterviewMapper;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.InterviewSessionRepository;

@Service
public class GetUserSessionsUseCase {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewMapper mapper;

    public GetUserSessionsUseCase(InterviewSessionRepository sessionRepository, InterviewMapper mapper) {
        this.sessionRepository = sessionRepository;
        this.mapper = mapper;
    }

    public Page<SessionSummaryResponse> execute(User user, Pageable pageable) {
        Page<InterviewSession> sessions = sessionRepository.findByUserWithJobOfferOrderByStartedAtDesc(user, pageable);
        return sessions.map(mapper::toSessionSummaryResponse);
    }
}
