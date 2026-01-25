package pl.ceveme.application.dto.interview;

public record ProgressDataPoint(
        String date,
        Integer score,
        String sessionMode
) {
}
