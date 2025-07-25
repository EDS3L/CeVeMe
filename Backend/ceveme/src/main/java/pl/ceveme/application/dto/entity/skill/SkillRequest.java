package pl.ceveme.application.dto.entity.skill;

import pl.ceveme.domain.model.entities.Skill;

import java.util.EnumSet;
import java.util.Optional;

public record SkillRequest(
        Long id,
        String email,
        String name,
        Skill.Type type
) {


    public SkillRequest {
        validate(name, type);
    }

    private static void validate(String name, Skill.Type type) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Skill name cannot be null!");
        }
        if (type == null) {
            throw new IllegalArgumentException("Type must not be blank");
        }
        if(!EnumSet.of(Skill.Type.SOFT, Skill.Type.TECHNICAL).contains(type)) {
            throw new IllegalArgumentException("Type must not be SOFT or TECHNICAL");        }
    }
}
