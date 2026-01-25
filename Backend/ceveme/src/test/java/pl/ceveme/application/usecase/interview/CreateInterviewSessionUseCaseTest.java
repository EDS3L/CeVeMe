package pl.ceveme.application.usecase.interview;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.interview.CreateSessionRequest;
import pl.ceveme.application.dto.interview.SessionResponse;
import pl.ceveme.application.mapper.InterviewMapper;
import pl.ceveme.domain.model.entities.InterviewQuestion;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.DifficultyLevel;
import pl.ceveme.domain.model.enums.QuestionCategory;
import pl.ceveme.domain.model.enums.SessionMode;
import pl.ceveme.domain.repositories.InterviewSessionRepository;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.infrastructure.external.interview.InterviewAIService;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateInterviewSessionUseCaseTest {

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private JobOfferRepository jobOfferRepository;

    @Mock
    private InterviewAIService aiService;

    @Mock
    private InterviewMapper mapper;

    @InjectMocks
    private CreateInterviewSessionUseCase useCase;

    private User user;
    private JobOffer jobOffer;
    private CreateSessionRequest request;

    @BeforeEach
    void setUp() {
        user = new User();
        jobOffer = new JobOffer();
        request = new CreateSessionRequest(1L, SessionMode.TEXT_BASIC, 5);
    }

    @Test
    void shouldCreateSessionSuccessfully() {
        List<InterviewQuestion> questions = List.of(
                InterviewQuestion.create("Test question", QuestionCategory.BEHAVIORAL, DifficultyLevel.MEDIUM, "key points", "star hint", 0)
        );

        when(jobOfferRepository.findById(1L)).thenReturn(Optional.of(jobOffer));
        when(aiService.generateQuestions(eq(jobOffer), eq(SessionMode.TEXT_BASIC), eq(5))).thenReturn(questions);
        when(sessionRepository.save(any(InterviewSession.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mapper.toSessionResponse(any(InterviewSession.class))).thenReturn(createMockSessionResponse());

        SessionResponse result = useCase.execute(request, user);

        assertThat(result).isNotNull();
        verify(sessionRepository).save(any(InterviewSession.class));
        verify(aiService).generateQuestions(eq(jobOffer), eq(SessionMode.TEXT_BASIC), eq(5));
    }

    @Test
    void shouldThrowExceptionWhenJobOfferNotFound() {
        when(jobOfferRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(request, user))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Job offer not found");
    }

    private SessionResponse createMockSessionResponse() {
        return new SessionResponse(
                1L, 1L, "Test Job", "Test Company",
                SessionMode.TEXT_BASIC, null, null, null,
                5, 0, null, null, List.of(), null
        );
    }
}
