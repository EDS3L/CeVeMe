package pl.ceveme.application.dto.skill;

import org.junit.jupiter.api.Test;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.domain.model.entities.Skill;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class SkillRequestTest {

    @Test
    void should_addSkill_when_ValuesIsCorrect() {
        // given
        String skillName = "java";

        // when
        SkillRequest request = new SkillRequest(1L, skillName, Skill.Type.SOFT, 1L);


        // then
        assertEquals(skillName, request.name());
    }

    @Test
    void should_throw_when_nameIsEmpty() {
        // given
        String skillName = "";
        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new SkillRequest(1L, skillName, Skill.Type.SOFT, 1L));
        assertThat(ex.getMessage()).isEqualTo("Skill name cannot be null!");
    }

}