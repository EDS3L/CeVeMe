package pl.ceveme.domain.model.entities;

import org.junit.jupiter.api.Test;
import pl.ceveme.domain.model.enums.DifficultyLevel;
import pl.ceveme.domain.model.enums.QuestionCategory;

import static org.assertj.core.api.Assertions.assertThat;

class InterviewQuestionTest {

    @Test
    void shouldCreateQuestionWithCorrectValues() {
        InterviewQuestion question = InterviewQuestion.create(
                "What is your experience?",
                QuestionCategory.BEHAVIORAL,
                DifficultyLevel.MEDIUM,
                "Experience details",
                "Describe STAR method",
                0
        );

        assertThat(question.getQuestionText()).isEqualTo("What is your experience?");
        assertThat(question.getCategory()).isEqualTo(QuestionCategory.BEHAVIORAL);
        assertThat(question.getDifficulty()).isEqualTo(DifficultyLevel.MEDIUM);
        assertThat(question.getExpectedKeyPoints()).isEqualTo("Experience details");
        assertThat(question.getStarHint()).isEqualTo("Describe STAR method");
        assertThat(question.getOrderIndex()).isEqualTo(0);
    }

    @Test
    void shouldReturnNotAnsweredWhenNoAnswer() {
        InterviewQuestion question = InterviewQuestion.create(
                "Test question",
                QuestionCategory.TECHNICAL,
                DifficultyLevel.EASY,
                null,
                null,
                0
        );

        assertThat(question.isAnswered()).isFalse();
    }

    @Test
    void shouldReturnAnsweredWhenAnswerExists() {
        InterviewQuestion question = InterviewQuestion.create(
                "Test question",
                QuestionCategory.TECHNICAL,
                DifficultyLevel.EASY,
                null,
                null,
                0
        );

        InterviewAnswer answer = InterviewAnswer.create("My answer", null, 30, question);
        question.setAnswer(answer);

        assertThat(question.isAnswered()).isTrue();
    }
}
