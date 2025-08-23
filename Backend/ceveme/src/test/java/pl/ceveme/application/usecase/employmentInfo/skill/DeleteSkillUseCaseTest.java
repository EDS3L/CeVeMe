package pl.ceveme.application.usecase.employmentInfo.skill;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeleteSkillUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private DeleteSkillUseCase deleteSkillUseCase;

    @Test
    void should_deleteSkill_when_exists() {
        // given
        Long skillId = 123L;
        Long infoId = 1L;
        Skill skill = createSkillWithId(skillId, "To delete", Skill.Type.TECHNICAL);

        EmploymentInfo info = new EmploymentInfo();
        info.addSkill(skill);

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when
        SkillResponse response = deleteSkillUseCase.execute(new DeleteEntityRequest(skillId, infoId));

        // then
        assertThat(response.name()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Skill deleted successfully");
    }

    @Test
    void should_throwException_when_skillNotFound() {
        // given
        Long skillId = 999L;
        Long infoId = 1L;
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteSkillUseCase.execute(new DeleteEntityRequest(skillId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("Skill not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long skillId = 999L;
        Long infoId = 1L;
        when(employmentInfoRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteSkillUseCase.execute(new DeleteEntityRequest(skillId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }

    // helper for test
    private Skill createSkillWithId(Long id, String name, Skill.Type type) {
        Skill skill = new Skill(name, type);
        try {
            java.lang.reflect.Field field = Skill.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(skill, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return skill;
    }
}
