package pl.ceveme.application.usecase.interview;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.interview.SubmitAnswerRequest;
import pl.ceveme.application.dto.interview.SubmitAnswerResponse;
import pl.ceveme.application.mapper.InterviewMapper;
import pl.ceveme.domain.model.entities.*;
import pl.ceveme.domain.model.enums.DifficultyLevel;
import pl.ceveme.domain.model.enums.QuestionCategory;
import pl.ceveme.domain.model.enums.SessionMode;
import pl.ceveme.domain.repositories.InterviewAnswerRepository;
import pl.ceveme.domain.repositories.InterviewQuestionRepository;
import pl.ceveme.domain.repositories.InterviewSessionRepository;
import pl.ceveme.infrastructure.external.interview.InterviewAIService;

import java.lang.reflect.Field;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmitAnswerUseCaseTest {

    @Mock
    private InterviewQuestionRepository questionRepository;

    @Mock
    private InterviewAnswerRepository answerRepository;

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private InterviewAIService aiService;

    @Mock
    private InterviewMapper mapper;

    @InjectMocks
    private SubmitAnswerUseCase useCase;

    private User user;
    private InterviewSession session;
    private InterviewQuestion question;
    private SubmitAnswerRequest request;

    @BeforeEach
    void setUp() throws Exception {
        user = new User();
        setUserId(user, 1L);

        session = InterviewSession.create(user, new JobOffer(), SessionMode.TEXT_BASIC, 5);
        question = InterviewQuestion.create("Test question?", QuestionCategory.BEHAVIORAL, DifficultyLevel.MEDIUM, "key points", null, 0);
        question.assignToSession(session);

        request = new SubmitAnswerRequest(1L, "My answer", null, 30);
    }

    @Test
    void shouldSubmitAnswerSuccessfully() {
        AnswerFeedback feedback = AnswerFeedback.create(80, 75, 80, 85, 70, 80, 85, 75, 80, "Good", "Improve", "Sample", "covered", "missed");

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(aiService.evaluateAnswer(eq(question), eq("My answer"), eq(SessionMode.TEXT_BASIC))).thenReturn(feedback);
        when(answerRepository.save(any(InterviewAnswer.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(sessionRepository.save(any(InterviewSession.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mapper.toFeedbackResponse(any())).thenReturn(null);

        SubmitAnswerResponse result = useCase.execute(request, user);

        assertThat(result).isNotNull();
        verify(answerRepository).save(any(InterviewAnswer.class));
        verify(aiService).evaluateAnswer(eq(question), eq("My answer"), eq(SessionMode.TEXT_BASIC));
    }

    @Test
    void shouldThrowExceptionWhenQuestionNotFound() {
        when(questionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(request, user))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Question not found");
    }

    @Test
    void shouldThrowExceptionWhenAnswerIsEmpty() {
        SubmitAnswerRequest emptyRequest = new SubmitAnswerRequest(1L, "", null, 30);

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        assertThatThrownBy(() -> useCase.execute(emptyRequest, user))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Answer cannot be empty");
    }

    private void setUserId(User user, Long id) throws Exception {
        Field idField = User.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(user, id);
    }
}
