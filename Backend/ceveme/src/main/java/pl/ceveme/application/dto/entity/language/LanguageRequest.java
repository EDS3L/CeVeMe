package pl.ceveme.application.dto.entity.language;

import java.util.Set;

public record LanguageRequest(
        Long id,
        String email,
        String name,
        String level
) {

    private static final Set<String> ALLOWED_LEVELS = Set.of(
            // CEFR
            "A1", "A2", "B1", "B2", "C1", "C2", "Native",

            // JLPT (Japoński)
            "N5", "N4", "N3", "N2", "N1",

            // HSK (Chiński)
            "HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6",

            // TOPIK (Koreański)
            "TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6"
    );

    public LanguageRequest {
        validate(name, level);
    }

    private static void validate(String name, String level) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Language cannot be null!");
        }
        if (level == null || level.isBlank()) {
            throw new IllegalArgumentException("Language level must not be blank");
        }
        if (!ALLOWED_LEVELS.contains(level)) {
            throw new IllegalArgumentException(
                    "Unsupported language level: " + level +
                            " (allowed: " + ALLOWED_LEVELS + ")"
            );
        }
    }
}