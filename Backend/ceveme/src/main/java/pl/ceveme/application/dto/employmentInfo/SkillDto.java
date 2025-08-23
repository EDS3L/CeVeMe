package pl.ceveme.application.dto.employmentInfo;

import pl.ceveme.domain.model.entities.Skill;

public record SkillDto(
        Long id,
        String name,
        Skill.Type type
) {
}
