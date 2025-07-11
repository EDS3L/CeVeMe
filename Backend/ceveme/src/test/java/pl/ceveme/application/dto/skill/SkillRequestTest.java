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
        String email = "test@wp.pl";
        String skillName = "java";

        // when
        SkillRequest request = new SkillRequest(email,skillName, Skill.Type.SOFT);


        // then
        assertEquals(skillName,request.name());
        assertEquals(email,request.email());
    }

    @Test
    void should_throw_when_nameIsEmpty() {
        // given
        String email = "test@wp.pl";
        String skillName = "";
        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new SkillRequest(email,skillName,Skill.Type.SOFT));
        assertThat(ex.getMessage()).isEqualTo("Skill name cannot be null!");
    }

}