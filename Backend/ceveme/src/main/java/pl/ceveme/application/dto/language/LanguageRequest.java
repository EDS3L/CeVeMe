package pl.ceveme.application.dto.language;

public record LanguageRequest(
        String email,
        String name,
        String level
) {
}
