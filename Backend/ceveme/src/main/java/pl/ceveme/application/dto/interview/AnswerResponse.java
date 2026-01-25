package pl.ceveme.application.dto.interview;

import java.time.LocalDateTime;

public record AnswerResponse(
        Long id,
        String answerText,
        String transcription,
        Integer responseTimeSeconds,
        LocalDateTime answeredAt,
        FeedbackResponse feedback
) {
}
