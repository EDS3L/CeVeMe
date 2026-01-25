package pl.ceveme.domain.model.entities;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AnswerFeedbackTest {

    @Test
    void shouldCreateFeedbackWithCorrectValues() {
        AnswerFeedback feedback = AnswerFeedback.create(
                85, 80, 75, 90, 85,
                80, 85, 75, 80,
                "Good structure", "More details needed",
                "Sample answer text", "Point 1, Point 2", "Point 3"
        );

        assertThat(feedback.getOverallScore()).isEqualTo(85);
        assertThat(feedback.getSituationScore()).isEqualTo(80);
        assertThat(feedback.getTaskScore()).isEqualTo(75);
        assertThat(feedback.getActionScore()).isEqualTo(90);
        assertThat(feedback.getResultScore()).isEqualTo(85);
        assertThat(feedback.getClarityScore()).isEqualTo(80);
        assertThat(feedback.getRelevanceScore()).isEqualTo(85);
        assertThat(feedback.getDepthScore()).isEqualTo(75);
        assertThat(feedback.getConfidenceScore()).isEqualTo(80);
        assertThat(feedback.getStrengths()).isEqualTo("Good structure");
        assertThat(feedback.getImprovements()).isEqualTo("More details needed");
    }

    @Test
    void shouldCalculateStarAverage() {
        AnswerFeedback feedback = AnswerFeedback.create(
                85, 80, 80, 80, 80,
                80, 85, 75, 80,
                "Strengths", "Improvements", "Sample", "covered", "missed"
        );

        int average = feedback.calculateStarAverage();

        assertThat(average).isEqualTo(80);
    }

    @Test
    void shouldReturnZeroWhenNoStarScores() {
        AnswerFeedback feedback = AnswerFeedback.create(
                85, null, null, null, null,
                80, 85, 75, 80,
                "Strengths", "Improvements", "Sample", "covered", "missed"
        );

        int average = feedback.calculateStarAverage();

        assertThat(average).isEqualTo(0);
    }
}
