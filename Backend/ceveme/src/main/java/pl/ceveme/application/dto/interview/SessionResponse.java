package pl.ceveme.application.dto.interview;

import pl.ceveme.domain.model.enums.SessionMode;
import pl.ceveme.domain.model.enums.SessionStatus;

import java.time.LocalDateTime;
import java.util.List;

public record SessionResponse(
        Long id,
        Long jobOfferId,
        String jobTitle,
        String company,
        SessionMode mode,
        SessionStatus status,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        Integer totalQuestions,
        Integer answeredQuestions,
        Integer overallScore,
        String jobOfferAnalysis,
        List<QuestionResponse> questions,
        QuestionResponse currentQuestion
) {
}
