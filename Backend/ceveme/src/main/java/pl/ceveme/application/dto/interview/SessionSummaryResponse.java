package pl.ceveme.application.dto.interview;

import pl.ceveme.domain.model.enums.SessionMode;

import java.time.LocalDateTime;

public record SessionSummaryResponse(
        Long id,
        Long jobOfferId,
        String jobTitle,
        String company,
        SessionMode mode,
        String status,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        Integer totalQuestions,
        Integer answeredQuestions,
        Integer overallScore
) {
}
