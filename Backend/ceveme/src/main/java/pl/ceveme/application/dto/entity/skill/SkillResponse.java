package pl.ceveme.application.dto.entity.skill;

import pl.ceveme.domain.model.entities.Skill;

public record SkillResponse(
        String name,
        Skill.Type type,
        String message
) {
}
