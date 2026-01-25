package pl.ceveme.application.usecase.interview;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.interview.CreateSessionRequest;
import pl.ceveme.application.dto.interview.SessionResponse;
import pl.ceveme.application.mapper.InterviewMapper;
import pl.ceveme.domain.model.entities.InterviewQuestion;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.InterviewSessionRepository;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.interview.InterviewAIService;

import java.util.List;

@Service
public class CreateInterviewSessionUseCase {

    private final InterviewSessionRepository sessionRepository;
    private final JobOfferRepository jobOfferRepository;
    private final InterviewAIService aiService;
    private final InterviewMapper mapper;

    public CreateInterviewSessionUseCase(InterviewSessionRepository sessionRepository,
                                         JobOfferRepository jobOfferRepository,
                                         InterviewAIService aiService,
                                         InterviewMapper mapper) {
        this.sessionRepository = sessionRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.aiService = aiService;
        this.mapper = mapper;
    }

    @Transactional
    public SessionResponse execute(CreateSessionRequest request, User user) {
        JobOffer jobOffer = jobOfferRepository.findById(request.jobOfferId())
                .orElseThrow(() -> new IllegalArgumentException("Job offer not found"));

        InterviewSession session = InterviewSession.create(
                user,
                jobOffer,
                request.mode(),
                request.questionCount()
        );

        List<InterviewQuestion> questions = aiService.generateQuestions(
                jobOffer,
                request.mode(),
                request.questionCount()
        );

        session.addQuestions(questions);

        InterviewSession savedSession = sessionRepository.save(session);

        return mapper.toSessionResponse(savedSession);
    }
}
