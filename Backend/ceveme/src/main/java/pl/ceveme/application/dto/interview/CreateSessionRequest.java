package pl.ceveme.application.dto.interview;

import pl.ceveme.domain.model.enums.SessionMode;

public record CreateSessionRequest(
        Long jobOfferId,
        SessionMode mode,
        Integer questionCount
) {
    public CreateSessionRequest {
        if (questionCount == null || questionCount < 1) {
            questionCount = 20;
        }
        if (questionCount > 30) {
            questionCount = 30;
        }
    }
}
