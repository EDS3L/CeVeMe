package pl.ceveme.application.dto.interview;

public record SubmitAnswerResponse(
        Long answerId,
        Long questionId,
        FeedbackResponse feedback,
        QuestionResponse nextQuestion,
        boolean sessionCompleted,
        Integer currentProgress,
        Integer totalQuestions
) {
}
