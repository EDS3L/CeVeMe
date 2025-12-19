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
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditSkillUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EditSkillUseCase editSkillUseCase;

    @Test
    void should_editSkill_when_skillExists() throws AccessDeniedException {
        // given
        Long userId = 1L;
        Long skillId = 10L;
        Skill skill = new Skill("Old Name", Skill.Type.SOFT);
        try {
            java.lang.reflect.Field field = Skill.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(skill, skillId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        SkillRequest request = new SkillRequest(skillId, "Updated Name", Skill.Type.TECHNICAL, userId);

        User user = new User();
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        EmploymentInfo info = new EmploymentInfo();
        info.addSkill(skill);
        user.setEmploymentInfo(info);
        info.setUser(user);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        SkillResponse response = editSkillUseCase.execute(request, userId);

        // then
        assertThat(response.name()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Skill updated successfully");
    }

    @Test
    void should_throwException_when_skillNotFound() {
        // given
        Long userId = 1L;
        SkillRequest request = new SkillRequest(99L, "Name", Skill.Type.TECHNICAL, userId);

        User user = new User();
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        EmploymentInfo info = new EmploymentInfo();
        user.setEmploymentInfo(info);
        info.setUser(user);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editSkillUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("Skill not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long userId = 999L;
        SkillRequest request = new SkillRequest(1L, "Any", Skill.Type.TECHNICAL, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editSkillUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("User not found");
    }
}
