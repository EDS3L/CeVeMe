package pl.ceveme.application.dto.entity.language;

public record LanguageResponse(
        Long id,
        String name,
        String level,
        String message
) {
}
