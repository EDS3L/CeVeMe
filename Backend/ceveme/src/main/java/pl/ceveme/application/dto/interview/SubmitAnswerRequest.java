package pl.ceveme.application.dto.interview;

public record SubmitAnswerRequest(
        Long questionId,
        String answerText,
        String transcription,
        Integer responseTimeSeconds
) {
}
