package pl.ceveme.domain.model.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.ceveme.domain.model.enums.DifficultyLevel;
import pl.ceveme.domain.model.enums.QuestionCategory;
import pl.ceveme.domain.model.enums.SessionMode;
import pl.ceveme.domain.model.enums.SessionStatus;

import static org.assertj.core.api.Assertions.assertThat;

class InterviewSessionTest {

    private User user;
    private JobOffer jobOffer;

    @BeforeEach
    void setUp() {
        user = new User();
        jobOffer = new JobOffer();
    }

    @Test
    void shouldCreateSessionWithCorrectInitialState() {
        InterviewSession session = InterviewSession.create(user, jobOffer, SessionMode.TEXT_BASIC, 10);

        assertThat(session.getStatus()).isEqualTo(SessionStatus.IN_PROGRESS);
        assertThat(session.getTotalQuestions()).isEqualTo(10);
        assertThat(session.getAnsweredQuestions()).isEqualTo(0);
        assertThat(session.isInProgress()).isTrue();
        assertThat(session.isCompleted()).isFalse();
    }

    @Test
    void shouldAddQuestionsToSession() {
        InterviewSession session = InterviewSession.create(user, jobOffer, SessionMode.TEXT_BASIC, 5);

        InterviewQuestion question1 = InterviewQuestion.create("Q1", QuestionCategory.BEHAVIORAL, DifficultyLevel.EASY, null, null, 0);
        InterviewQuestion question2 = InterviewQuestion.create("Q2", QuestionCategory.TECHNICAL, DifficultyLevel.MEDIUM, null, null, 1);

        session.addQuestion(question1);
        session.addQuestion(question2);

        assertThat(session.getQuestions()).hasSize(2);
        assertThat(question1.getSession()).isEqualTo(session);
        assertThat(question2.getSession()).isEqualTo(session);
    }

    @Test
    void shouldCompleteSessionWhenAllQuestionsAnswered() {
        InterviewSession session = InterviewSession.create(user, jobOffer, SessionMode.TEXT_BASIC, 2);

        session.recordAnswer();
        assertThat(session.isCompleted()).isFalse();

        session.recordAnswer();
        assertThat(session.isCompleted()).isTrue();
        assertThat(session.getStatus()).isEqualTo(SessionStatus.COMPLETED);
        assertThat(session.getCompletedAt()).isNotNull();
    }

    @Test
    void shouldAbandonSession() {
        InterviewSession session = InterviewSession.create(user, jobOffer, SessionMode.TEXT_BASIC, 10);

        session.abandon();

        assertThat(session.getStatus()).isEqualTo(SessionStatus.ABANDONED);
        assertThat(session.getCompletedAt()).isNotNull();
    }

    @Test
    void shouldGetCurrentQuestion() {
        InterviewSession session = InterviewSession.create(user, jobOffer, SessionMode.TEXT_BASIC, 2);

        InterviewQuestion question1 = InterviewQuestion.create("Q1", QuestionCategory.BEHAVIORAL, DifficultyLevel.EASY, null, null, 0);
        InterviewQuestion question2 = InterviewQuestion.create("Q2", QuestionCategory.TECHNICAL, DifficultyLevel.MEDIUM, null, null, 1);

        session.addQuestion(question1);
        session.addQuestion(question2);

        assertThat(session.getCurrentQuestion()).isPresent();
        assertThat(session.getCurrentQuestion().get().getQuestionText()).isEqualTo("Q1");
    }

    @Test
    void shouldSetAnalysisResults() {
        InterviewSession session = InterviewSession.create(user, jobOffer, SessionMode.TEXT_BASIC, 5);

        session.setAnalysisResults("Recommendations", "Strengths", "Weaknesses");

        assertThat(session.getRecommendations()).isEqualTo("Recommendations");
        assertThat(session.getStrengthsSummary()).isEqualTo("Strengths");
        assertThat(session.getWeaknessesSummary()).isEqualTo("Weaknesses");
    }
}
