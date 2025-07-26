package pl.ceveme.application.usecase.employmentInfo.experience;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
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
class DeleteExperienceUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private DeleteExperienceUseCase deleteExperienceUseCase;

    @Test
    void should_deleteExperience_when_exists() {
        // given
        Long experienceId = 123L;
        Long infoId = 1L;
        Experience experience = createExperienceWithId(experienceId, "To delete", "Position", LocalDate.now().minusYears(1), LocalDate.now());

        EmploymentInfo info = new EmploymentInfo();
        info.addExperience(experience);

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when
        ExperienceResponse response = deleteExperienceUseCase.execute(new DeleteEntityRequest(experienceId, infoId));

        // then
        assertThat(response.companyName()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Experience deleted successfully");
    }

    @Test
    void should_throwException_when_experienceNotFound() {
        // given
        Long experienceId = 999L;
        Long infoId = 1L;
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteExperienceUseCase.execute(new DeleteEntityRequest(experienceId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("Experience not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long experienceId = 999L;
        Long infoId = 1L;
        when(employmentInfoRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteExperienceUseCase.execute(new DeleteEntityRequest(experienceId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }

    // helper for test
    private Experience createExperienceWithId(Long id, String companyName, String position, LocalDate startDate, LocalDate endDate) {
        Experience experience = new Experience(companyName,startDate,endDate,false,position,"DESCP","Responsibilities");
        try {
            java.lang.reflect.Field field = Experience.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(experience, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return experience;
    }
}
