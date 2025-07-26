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
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditExperienceUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private EditExperienceUseCase editExperienceUseCase;

    @Test
    void should_editExperience_when_experienceExists() {
        // given
        Long employmentInfoId = 1L;
        Long experienceId = 10L;
        Experience experience = new Experience("Old Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST");
        try {
            java.lang.reflect.Field field = Experience.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(experience, experienceId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        ExperienceRequest request = new ExperienceRequest(experienceId, "test@wp.pl", "Updated Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST");
        EmploymentInfo info = new EmploymentInfo();
        info.addExperience(experience);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when
        ExperienceResponse response = editExperienceUseCase.execute(request, employmentInfoId);

        // then
        assertThat(response.companyName()).isEqualTo("Updated Company");
        assertThat(response.message()).isEqualTo("Experience updated successfully");
    }

    @Test
    void should_throwException_when_experienceNotFound() {
        // given
        Long employmentInfoId = 1L;
        ExperienceRequest request = new ExperienceRequest(99L, "test@wp.pl", "Old Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST");
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editExperienceUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("Experience not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long employmentInfoId = 999L;
        ExperienceRequest request = new ExperienceRequest(1L, "test@wp.pl", "Old Company", LocalDate.now().minusYears(2), LocalDate.now().minusYears(1),false,"TEST","TEST","TEST");

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editExperienceUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }
}
