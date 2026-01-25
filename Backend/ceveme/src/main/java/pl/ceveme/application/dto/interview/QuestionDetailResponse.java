package pl.ceveme.application.dto.interview;

public record QuestionDetailResponse(
        Long questionId,
        String questionText,
        String category,
        String difficulty,
        String answerText,
        Integer responseTimeSeconds,
        FeedbackResponse feedback
) {
}
