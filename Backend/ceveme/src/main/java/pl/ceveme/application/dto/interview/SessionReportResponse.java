package pl.ceveme.application.dto.interview;

import java.util.List;
import java.util.Map;

public record SessionReportResponse(
        Long sessionId,
        String jobTitle,
        String company,
        String mode,
        String status,
        String startedAt,
        String completedAt,
        Integer totalQuestions,
        Integer answeredQuestions,
        Integer overallScore,
        String recommendations,
        String strengthsSummary,
        String weaknessesSummary,
        Map<String, Integer> categoryScores,
        Map<String, Integer> skillScores,
        List<QuestionDetailResponse> questionDetails
) {
}
