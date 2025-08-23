package pl.ceveme.application.usecase.employmentInfo.skill;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditSkillUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private EditSkillUseCase editSkillUseCase;

    @Test
    void should_editSkill_when_skillExists() {
        // given
        Long employmentInfoId = 1L;
        Long skillId = 10L;
        Skill skill = new Skill("Old Name", Skill.Type.SOFT);
        try {
            java.lang.reflect.Field field = Skill.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(skill, skillId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        SkillRequest request = new SkillRequest(skillId, "test@wp.pl", "Updated Name", Skill.Type.TECHNICAL);
        EmploymentInfo info = new EmploymentInfo();
        info.addSkill(skill);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when
        SkillResponse response = editSkillUseCase.execute(request, employmentInfoId);

        // then
        assertThat(response.name()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Skill updated successfully");
    }

    @Test
    void should_throwException_when_skillNotFound() {
        // given
        Long employmentInfoId = 1L;
        SkillRequest request = new SkillRequest(99L, "test@wp.pl", "Name", Skill.Type.TECHNICAL);
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editSkillUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("Skill not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long employmentInfoId = 999L;
        SkillRequest request = new SkillRequest(1L, "test@wp.pl", "Any", Skill.Type.TECHNICAL);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editSkillUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }
}
