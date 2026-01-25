package pl.ceveme.application.dto.interview;

import pl.ceveme.domain.model.enums.DifficultyLevel;
import pl.ceveme.domain.model.enums.QuestionCategory;

public record QuestionResponse(
        Long id,
        String questionText,
        QuestionCategory category,
        DifficultyLevel difficulty,
        String starHint,
        Integer orderIndex,
        boolean isAnswered
) {
}
