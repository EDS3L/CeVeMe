package pl.ceveme.application.dto.interview;

import java.util.List;
import java.util.Map;

public record UserStatsResponse(
        Long totalSessions,
        Long completedSessions,
        Double averageScore,
        Integer bestScore,
        Map<String, Long> sessionsByMode,
        Map<String, Double> averageScoreByCategory,
        List<ProgressDataPoint> progressHistory,
        List<String> earnedBadges
) {
}
