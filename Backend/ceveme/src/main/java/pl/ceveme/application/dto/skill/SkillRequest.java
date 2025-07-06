package pl.ceveme.application.dto.skill;

import pl.ceveme.domain.model.entities.Skill;

public record SkillRequest(
        String email,
        String name,
        Skill.Type type
) {
}
