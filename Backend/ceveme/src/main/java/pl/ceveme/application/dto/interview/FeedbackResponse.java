package pl.ceveme.application.dto.interview;

public record FeedbackResponse(
        Long id,
        Integer overallScore,
        Integer situationScore,
        Integer taskScore,
        Integer actionScore,
        Integer resultScore,
        Integer clarityScore,
        Integer relevanceScore,
        Integer depthScore,
        Integer confidenceScore,
        String strengths,
        String improvements,
        String sampleAnswer,
        String keyPointsCovered,
        String keyPointsMissed
) {
}
