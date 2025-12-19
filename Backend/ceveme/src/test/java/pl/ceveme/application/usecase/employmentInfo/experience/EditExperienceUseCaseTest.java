package pl.ceveme.application.usecase.employmentInfo.experience;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Experience;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditExperienceUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EditExperienceUseCase editExperienceUseCase;

    @Test
    void should_editExperience_when_experienceExists() throws AccessDeniedException {
        // given
        Long userId = 1L;
        Long experienceId = 10L;
        Experience experience = new Experience("Old Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST");
        try {
            java.lang.reflect.Field field = Experience.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(experience, experienceId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        ExperienceRequest request = new ExperienceRequest(experienceId, "Updated Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST", userId);

        User user = new User();
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        EmploymentInfo info = new EmploymentInfo();
        info.addExperience(experience);
        user.setEmploymentInfo(info);
        info.setUser(user);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        ExperienceResponse response = editExperienceUseCase.execute(request, userId);

        // then
        assertThat(response.companyName()).isEqualTo("Updated Company");
        assertThat(response.message()).isEqualTo("Experience updated successfully");
    }

    @Test
    void should_throwException_when_experienceNotFound() {
        // given
        Long userId = 1L;
        ExperienceRequest request = new ExperienceRequest(99L, "Old Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST", userId);

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
                () -> editExperienceUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("Experience not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long userId = 999L;
        ExperienceRequest request = new ExperienceRequest(1L, "Old Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST", userId);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editExperienceUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("User not found");
    }
}
