package pl.ceveme.application.usecase.interview;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.interview.SessionResponse;
import pl.ceveme.application.mapper.InterviewMapper;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.InterviewSessionRepository;

@Service
public class GetInterviewSessionUseCase {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewMapper mapper;

    public GetInterviewSessionUseCase(InterviewSessionRepository sessionRepository, InterviewMapper mapper) {
        this.sessionRepository = sessionRepository;
        this.mapper = mapper;
    }

    public SessionResponse execute(Long sessionId, User user) {
        InterviewSession session = sessionRepository.findByIdWithQuestionsAndAnswers(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        return mapper.toSessionResponse(session);
    }
}
